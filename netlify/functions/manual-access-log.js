// Private access-log viewer. Shows who opened the service manual and when.
// Gated: requires a valid session cookie AND the email must be on the allowlist.
// GET /.netlify/functions/manual-access-log            -> HTML table
// GET /.netlify/functions/manual-access-log?format=csv -> CSV download
//
// Netlify Functions v2 (ESM) so Blobs auto-configures. Env: MANUAL_AUTH_SECRET
import { getStore } from '@netlify/blobs';
import auth from './lib/manualAuth.js';

const STORE = 'manual-access-log';

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

export default async (req) => {
  const secret = process.env.MANUAL_AUTH_SECRET;
  const session = auth.sessionFromCookies(req.headers.get('cookie'), secret);

  if (!session || !session.e) {
    return new Response('', { status: 302, headers: { Location: '/manual-login.html?next=' + encodeURIComponent('/.netlify/functions/manual-access-log') } });
  }
  if (!auth.isAllowed(session.e)) {
    return new Response('<p style="font-family:sans-serif">Your account is not permitted to view the access log.</p>', { status: 403, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  let rows = [];
  try {
    const store = getStore(STORE);
    const listed = await store.list();
    const keys = (listed.blobs || []).map((b) => b.key);
    const vals = await Promise.all(keys.map((k) => store.get(k, { type: 'json' }).catch(() => null)));
    rows = vals.filter(Boolean);
  } catch (e) {
    console.error('[manual-access-log] read failed:', e && e.message);
  }
  rows.sort((a, b) => (b.ts || '').localeCompare(a.ts || ''));

  const url = new URL(req.url);
  if (url.searchParams.get('format') === 'csv') {
    const q = (v) => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
    const lines = ['Timestamp,Email,Page'].concat(rows.map((r) => [q(r.ts), q(r.email), q(r.page)].join(',')));
    return new Response(lines.join('\r\n'), { status: 200, headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="service-manual-access-log.csv"', 'Cache-Control': 'no-store' } });
  }

  const tbody = rows.map((r) => {
    const d = r.ts ? new Date(r.ts) : null;
    const when = d && !isNaN(d) ? d.toISOString().replace('T', ' ').slice(0, 19) + ' UTC' : esc(r.ts);
    return `<tr><td>${esc(when)}</td><td>${esc(r.email)}</td><td>${esc(r.page)}</td></tr>`;
  }).join('');

  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/><meta name="robots" content="noindex,nofollow"/>
<title>Service Manual — Access Log</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet"/>
<style>
 :root{--accent:#4a9eff;--off-white:#f0f4ff;--muted:#7a9abf;--dark:#060f1e;--card:#0d1f38;--border:rgba(74,158,255,.18);}
 *{box-sizing:border-box;} body{margin:0;background:var(--dark);color:var(--off-white);font-family:'DM Sans',sans-serif;padding:28px;}
 .head{display:flex;align-items:center;gap:10px;margin-bottom:6px;}
 .wordmark{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:22px;letter-spacing:.14em;text-transform:uppercase;}
 h1{font-family:'Barlow Condensed',sans-serif;font-weight:600;font-size:24px;margin:14px 0 4px;}
 .sub{color:var(--muted);font-size:14px;margin:0 0 18px;}
 .bar{display:flex;gap:10px;align-items:center;margin-bottom:14px;flex-wrap:wrap;}
 input{padding:9px 12px;font-size:14px;font-family:inherit;color:var(--off-white);background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:8px;min-width:220px;}
 input:focus{outline:none;border-color:var(--accent);}
 a.btn,button{font-family:inherit;font-size:14px;font-weight:600;color:#fff;background:var(--accent);border:0;border-radius:8px;padding:9px 14px;text-decoration:none;cursor:pointer;}
 table{width:100%;border-collapse:collapse;font-size:14px;background:var(--card);border:1px solid var(--border);border-radius:10px;overflow:hidden;}
 th,td{text-align:left;padding:10px 14px;border-bottom:1px solid var(--border);}
 th{color:var(--muted);font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:.04em;}
 tr:last-child td{border-bottom:0;} td{white-space:nowrap;}
 .count{color:var(--muted);font-size:13px;}
</style></head><body>
 <div class="head">
   <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true"><rect width="32" height="32" rx="3" fill="#060f1e"/><polygon points="18,3 8,18 15,18 14,29 24,14 17,14" fill="#4a9eff"/></svg>
   <span class="wordmark">Windrose</span>
 </div>
 <h1>Service Manual — Access Log</h1>
 <p class="sub">Who opened the service manual, and when. Signed in as ${esc(session.e)}.</p>
 <div class="bar">
   <input id="filter" type="text" placeholder="Filter by email or date…"/>
   <a class="btn" href="/.netlify/functions/manual-access-log?format=csv">Download CSV</a>
   <span class="count" id="count">${rows.length} view${rows.length === 1 ? '' : 's'}</span>
 </div>
 <table><thead><tr><th>Time (UTC)</th><th>Email</th><th>Page</th></tr></thead>
 <tbody id="tb">${tbody || '<tr><td colspan="3" style="color:#7a9abf">No views recorded yet.</td></tr>'}</tbody></table>
<script>
 var f=document.getElementById('filter'),tb=document.getElementById('tb'),cnt=document.getElementById('count');
 var all=[].slice.call(tb.querySelectorAll('tr'));
 f.addEventListener('input',function(){var q=f.value.toLowerCase(),n=0;
   all.forEach(function(tr){var m=tr.textContent.toLowerCase().indexOf(q)>-1;tr.style.display=m?'':'none';if(m)n++;});
   cnt.textContent=n+(n===1?' view':' views');});
</script>
</body></html>`;

  return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
};
