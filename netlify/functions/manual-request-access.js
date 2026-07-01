// POST { email, name, note } — someone who is NOT on the allowlist asks for
// access. Emails the request to the approver inbox (MANUAL_ACCESS_REQUEST_TO,
// default service@windrose.ai) so an admin can add them to MANUAL_ALLOWED_EMAILS.
//
// Required env vars: RESEND_API_KEY
// Optional: MANUAL_ACCESS_REQUEST_TO (default service@windrose.ai),
//           MANUAL_FROM_EMAIL (default "Windrose Service Manual <noreply@windrose.ai>")

const auth = require('./lib/manualAuth');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};
const GENERIC = JSON.stringify({ ok: true, message: 'Your request has been sent. A Windrose administrator will review it and grant access.' });

function esc(s) {
  return String(s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])).slice(0, 500);
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch { return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

  const email = (body.email || '').trim();
  const name = (body.name || '').trim();
  const note = (body.note || '').trim();
  if (!auth.validEmail(email)) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Please enter a valid email address.' }) };

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.MANUAL_ACCESS_REQUEST_TO || 'service@windrose.ai';
  const from = process.env.MANUAL_FROM_EMAIL || 'Windrose Service Manual <noreply@windrose.ai>';

  if (!apiKey) {
    console.error('[manual-request-access] RESEND_API_KEY not set');
    return { statusCode: 200, headers: CORS, body: GENERIC }; // generic to the user
  }

  const text =
`New service-manual access request

Email: ${email}
Name:  ${name || '(not provided)'}
Note:  ${note || '(none)'}

To grant access, add this email to the MANUAL_ALLOWED_EMAILS environment
variable in Netlify (Site configuration -> Environment variables), then
redeploy. The person can then request a sign-in link at /manual-login.html.`;
  const html =
`<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;color:#1a1a1a">
  <h2 style="font-size:18px;margin:0 0 12px">New service-manual access request</h2>
  <table style="font-size:14px;border-collapse:collapse">
    <tr><td style="padding:4px 12px 4px 0;color:#6b7280">Email</td><td><strong>${esc(email)}</strong></td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#6b7280">Name</td><td>${esc(name) || '(not provided)'}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#6b7280;vertical-align:top">Note</td><td>${esc(note) || '(none)'}</td></tr>
  </table>
  <p style="font-size:13px;line-height:1.5;color:#444;margin-top:18px">To grant access, add this email to <code>MANUAL_ALLOWED_EMAILS</code> in Netlify (Site configuration → Environment variables) and redeploy. They can then request a sign-in link at <code>/manual-login.html</code>.</p>
</div>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, reply_to: email, subject: `Service manual access request — ${email}`, text, html }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  } catch (e) {
    console.error('[manual-request-access] send failed:', e && e.message);
    return { statusCode: 200, headers: CORS, body: GENERIC };
  }

  return { statusCode: 200, headers: CORS, body: GENERIC };
};
