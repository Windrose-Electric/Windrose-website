// POST { email, next } -> emails a magic sign-in link IF the address is on the
// allowlist. Always returns a generic success so the endpoint can't be used to
// probe which addresses are authorized (no email enumeration).
//
// Required env vars: MANUAL_AUTH_SECRET, MANUAL_ALLOWED_EMAILS, RESEND_API_KEY
// Optional: MANUAL_FROM_EMAIL (default "Windrose Service Manual <noreply@windrose.ai>")

const auth = require('./lib/manualAuth');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};
const GENERIC = JSON.stringify({
  ok: true,
  message: 'If that address is authorized, a sign-in link is on its way. Check your inbox.',
});

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch { return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

  const email = (body.email || '').trim().toLowerCase();
  const next = auth.safeNext(body.next);
  const secret = process.env.MANUAL_AUTH_SECRET;

  // Validate shape, but respond generically regardless of allowlist membership.
  if (auth.validEmail(email) && secret && auth.isAllowed(email)) {
    try {
      const token = auth.makeLinkToken(email, next, secret);
      const url = `${auth.siteBase(event)}/.netlify/functions/manual-verify?token=${encodeURIComponent(token)}`;
      await sendEmail(email, url);
    } catch (e) {
      console.error('[manual-request-link] send failed:', e && e.message);
      // still return generic success — do not leak server state to the client
    }
  } else if (!secret) {
    console.error('[manual-request-link] MANUAL_AUTH_SECRET not configured');
  }

  return { statusCode: 200, headers: CORS, body: GENERIC };
};

async function sendEmail(to, url) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY not set');
  const from = process.env.MANUAL_FROM_EMAIL || 'Windrose Service Manual <noreply@windrose.ai>';
  const text =
`Sign in to the Windrose Service Manual

Click the link below to open the service manual. The link expires in 15 minutes and can only be used from this request.

${url}

If you did not request this, you can ignore this email.`;
  const html =
`<div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;color:#1a1a1a">
  <h2 style="font-size:18px;margin:0 0 12px">Sign in to the Windrose Service Manual</h2>
  <p style="font-size:14px;line-height:1.5;color:#444">Click the button below to open the service manual. This link expires in <strong>15 minutes</strong>.</p>
  <p style="margin:24px 0">
    <a href="${url}" style="background:#0a5;color:#fff;text-decoration:none;padding:12px 22px;border-radius:6px;font-size:15px;display:inline-block">Open the service manual</a>
  </p>
  <p style="font-size:12px;line-height:1.5;color:#888">If the button doesn't work, paste this link into your browser:<br><span style="word-break:break-all">${url}</span></p>
  <p style="font-size:12px;color:#aaa;margin-top:24px">If you didn't request this, you can safely ignore this email.</p>
</div>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject: 'Your Windrose service manual sign-in link', text, html }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}
