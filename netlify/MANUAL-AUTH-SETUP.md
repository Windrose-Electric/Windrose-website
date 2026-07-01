# Service Manual login (magic-link) — setup

Gates `/service-manual-us/*` behind an email magic-link login. Nothing is served
from that path without a valid signed session cookie.

## How it works

1. Visitor hits `/service-manual-us/…` → **edge function** `manual-gate.js` checks the
   `wr_manual_session` cookie. No/invalid cookie → redirect to `/manual-login.html`.
2. Visitor enters email → `manual-request-link` function. If the address is on the
   **allowlist**, it emails a one-time link (valid 15 min) via Resend. The response is
   always generic, so the endpoint can't be used to discover who's authorized.
3. Visitor clicks the link → `manual-verify` validates it, sets an HttpOnly, Secure
   session cookie (valid 30 days), and redirects into the manual.
4. `/.netlify/functions/manual-logout` clears the cookie.

## Required environment variables

Set in **Netlify → Site configuration → Environment variables**:

| Variable | Example | Notes |
|---|---|---|
| `MANUAL_AUTH_SECRET` | (64 random hex chars) | Signs link + session tokens. Generate: `openssl rand -hex 32`. Rotating it logs everyone out. |
| `MANUAL_ALLOWED_EMAILS` | `a@dealer.com, b@windrose.ai` | Who may receive a link. Comma/space/newline separated, case-insensitive. |
| `RESEND_API_KEY` | `re_...` | From resend.com. The sending domain (`windrose.ai`) must be verified in Resend. |
| `MANUAL_FROM_EMAIL` | `Windrose Service Manual <noreply@windrose.ai>` | Optional. Must be on the verified domain. |
| `MANUAL_ACCESS_REQUEST_TO` | `service@windrose.ai` | Optional (default `service@windrose.ai`). Where "Request access" submissions are emailed. |

## Access log (who viewed the manual, and when)

The edge gate fires a background call to `manual-log` on each manual **page open**
(not per image/CSS asset). `manual-log` re-verifies the session cookie and appends
one entry `{ ts, email, page }` to a **Netlify Blobs** store (`manual-access-log`).
No extra env vars or Google setup — it uses `MANUAL_AUTH_SECRET`.

View it at **`/.netlify/functions/manual-access-log`** — a private page (requires a
valid session and an allowlisted email) showing a filterable table, a live count,
and a **Download CSV** button (`?format=csv`). Data is email + timestamp + page only
(no IP). To purge history, clear the `manual-access-log` blob store.

## Access requests

The login page has a **Request access** button for people not yet on the allowlist.
It emails the requester's details (email, name, note) to `MANUAL_ACCESS_REQUEST_TO`
via `manual-request-access`. To approve, add their email to `MANUAL_ALLOWED_EMAILS`
and redeploy — they can then request a sign-in link.

`URL` is provided automatically by Netlify and is used to build the link.

## Notes / tradeoffs

- **Single-use links:** links expire after 15 min but aren't invalidated on first use
  (no datastore). Short TTL keeps the replay window small. Add Netlify Blobs to track
  used nonces if strict one-time use is required.
- **Adding/removing people:** edit `MANUAL_ALLOWED_EMAILS` (takes effect on next link
  request). To force-revoke an active session before its 30-day expiry, rotate
  `MANUAL_AUTH_SECRET` (logs everyone out).
- **More manual editions:** add the path to `config.path` in
  `netlify/edge-functions/manual-gate.js` (e.g. `/service-manual-eu/*`).
- Until the env vars are set, the gate **fails closed** — the manual stays inaccessible.
