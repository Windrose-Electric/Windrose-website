#!/usr/bin/env node
// Runs during Netlify build to stamp every owner's manual and index.html
// with today's date in the correct locale. Add to netlify.toml [build] command.

const fs = require('fs');
const path = require('path');

const now = new Date();
const iso = now.toISOString().slice(0, 10); // e.g. "2026-06-27"
const opts = { year: 'numeric', month: 'long', day: 'numeric' };

const EDITIONS = [
  { dir: 'owners-manual-us',                locale: 'en-US' },
  { dir: 'owners-manual-eu',                locale: 'en-GB' },
  { dir: 'owners-manual-uk',                locale: 'en-GB' },
  { dir: 'owners-manual-au',                locale: 'en-GB' },
  { dir: 'owners-manual-australia',         locale: 'en-AU' },
  { dir: 'owners-manual-german',            locale: 'de-DE' },
  { dir: 'owners-manual-french',            locale: 'fr-FR' },
  { dir: 'owners-manual-spanish',           locale: 'es-ES' },
  { dir: 'owners-manual-italian',           locale: 'it-IT' },
  { dir: 'owners-manual-portuguese',        locale: 'pt-PT' },
  { dir: 'owners-manual-dutch',             locale: 'nl-NL' },
  { dir: 'owners-manual-swedish',           locale: 'sv-SE' },
  { dir: 'owners-manual-norsk',             locale: 'nb-NO' },
  { dir: 'owners-manual-danish',            locale: 'da-DK' },
  { dir: 'owners-manual-finnish',           locale: 'fi-FI' },
  { dir: 'owners-manual-polish',            locale: 'pl-PL' },
  { dir: 'owners-manual-icelandic',         locale: 'is-IS' },
  { dir: 'owners-manual-hebrew',            locale: 'he-IL' },
  { dir: 'owners-manual-arabic',            locale: 'ar-MA-u-nu-latn' },
  { dir: 'owners-manual-turkish',           locale: 'tr-TR' },
  { dir: 'owners-manual-chinese-simplified',  locale: 'zh-CN' },
  { dir: 'owners-manual-chinese-traditional', locale: 'zh-TW' },
  { dir: 'owners-manual-korean',            locale: 'ko-KR' },
  { dir: 'owners-manual-japanese',          locale: 'ja-JP' },
];

const root = path.join(__dirname);

// ── Owner's manual editions ──────────────────────────────────────────────────
for (const { dir, locale } of EDITIONS) {
  const file = path.join(root, dir, 'index.html');
  if (!fs.existsSync(file)) continue;

  const localDate = new Intl.DateTimeFormat(locale, opts).format(now);
  let html = fs.readFileSync(file, 'utf8');

  // Replace <time datetime="...">...</time> inside .manual-updated
  const updated = html.replace(
    /(<time\s+datetime=")[^"]*(">[^<]*<\/time>)/,
    `$1${iso}${'">' + localDate + '</time>'}`
  );

  if (updated !== html) {
    fs.writeFileSync(file, updated, 'utf8');
    console.log(`Updated ${dir}: ${localDate}`);
  } else {
    console.log(`No change: ${dir}`);
  }
}

// ── Main site pages (topbar version-timestamp + UPDATED marker) ─────────────
const SITE_PAGES = [
  'index.html', 'technology.html', 'how-to-buy.html', 'how-to-use.html',
  'how-to-service.html', 'how-to-build.html', 'about-us.html',
  'windrose-user-manual-zh.html',
  // -edit variants
  'index-edit.html', 'technology-edit.html', 'how-to-buy-edit.html',
  'how-to-use-edit.html', 'how-to-service-edit.html', 'how-to-build-edit.html',
  'about-us-edit.html',
];

const localDate = new Intl.DateTimeFormat('en-GB', opts).format(now);

// Two formats exist across pages:
//   With inner span:    <span class="version-timestamp" ...><span ...>Updated:</span> DATE</span>
//   Without inner span: <span class="version-timestamp" ...>Updated: DATE</span>
const versionTimestampRe  = /(class="version-timestamp"[^>]*><span[^>]*>[^<]*<\/span>)[^<]*(<\/span>)/;
const versionTimestampRe2 = /(class="version-timestamp"[^>]*>Updated:)[^<]*(<\/span>)/;

for (const page of SITE_PAGES) {
  const file = path.join(root, page);
  if (!fs.existsSync(file)) continue;

  let html = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Update topbar version-timestamp (try both formats)
  let r1 = html.replace(versionTimestampRe, `$1 ${localDate}$2`);
  if (r1 === html) r1 = html.replace(versionTimestampRe2, `$1 ${localDate}$2`);
  if (r1 !== html) { html = r1; changed = true; }

  // Update inline <!--UPDATED--> marker (index.html body section)
  const r2 = html.replace(/<!--UPDATED-->[\s\S]*?<!--\/UPDATED-->/, `<!--UPDATED-->${localDate}<!--/UPDATED-->`);
  if (r2 !== html) { html = r2; changed = true; }

  if (changed) {
    fs.writeFileSync(file, html, 'utf8');
    console.log(`Updated ${page}: ${localDate}`);
  } else {
    console.log(`No change: ${page}`);
  }
}

console.log('Timestamps updated to', iso);
