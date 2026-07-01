// GET ?token=... — validates a magic-link token, and on success sets the
// long-lived session cookie and redirects into the manual.
// Required env var: MANUAL_AUTH_SECRET

const auth = require('./lib/manualAuth');

exports.handler = async (event) => {
  const secret = process.env.MANUAL_AUTH_SECRET;
  const token = (event.queryStringParameters && event.queryStringParameters.token) || '';

  const fail = (reason) => ({
    statusCode: 302,
    headers: { Location: `/manual-login.html?error=${reason}` },
    body: '',
  });

  if (!secret) { console.error('[manual-verify] MANUAL_AUTH_SECRET not configured'); return fail('config'); }

  const payload = auth.verify(token, secret, 'l');
  if (!payload) return fail('expired');

  const session = auth.makeSessionToken(payload.e, secret);
  const next = auth.safeNext(payload.nx);
  return {
    statusCode: 302,
    headers: { Location: next, 'Set-Cookie': auth.sessionCookie(session), 'Cache-Control': 'no-store' },
    body: '',
  };
};
