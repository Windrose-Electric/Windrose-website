# Windrose Website — Claude Code Context

## Stack
- Static HTML site hosted on **Netlify**; auto-deploys on push to `main`
- `netlify.toml`: `publish = "."`, `functions = "netlify/functions"`
- GitHub repo: `git@github.com:Windrose-Electric/Windrose-website.git`
- Always use `target="_blank" rel="noopener"` on external links; never link to internal `/press/` pages — always use external windrose.ai URLs

## Owner's Manual

22 language editions at `/owners-manual-{lang}/index.html`, each with its own `styles.css`.

### Critical layout rule
Every edition requires `<main class="main-content" id="mainContent">` immediately after `</nav>`. Without it, all content renders outside the CSS layout container — images go full-width, sidebar offset is ignored, and `max-width: 960px` has no effect.

### Language editions
| Folder | Language | Notes |
|---|---|---|
| `owners-manual-us` | English (US) | Primary source; uses "center" spelling |
| `owners-manual-eu` | English (EU) | Uses "centre" spelling |
| `owners-manual-uk` | English (UK) | Uses "centre" spelling |
| `owners-manual-au` | English (AU) | Uses "centre" spelling; shares images with UK |
| `owners-manual-australia` | English (AU alt) | Separate edition |
| `owners-manual-german` | German | |
| `owners-manual-french` | French | |
| `owners-manual-spanish` | Spanish | |
| `owners-manual-italian` | Italian | |
| `owners-manual-portuguese` | Portuguese | |
| `owners-manual-dutch` | Dutch | |
| `owners-manual-swedish` | Swedish | |
| `owners-manual-norsk` | Norwegian | |
| `owners-manual-danish` | Danish | |
| `owners-manual-finnish` | Finnish | |
| `owners-manual-polish` | Polish | |
| `owners-manual-icelandic` | Icelandic | |
| `owners-manual-hebrew` | Hebrew | RTL — see Hebrew section below |
| `owners-manual-arabic` | Arabic | RTL |
| `owners-manual-turkish` | Turkish | |
| `owners-manual-chinese-traditional` | Traditional Chinese | CJK — alt texts not yet translated |
| `owners-manual-korean` | Korean | CJK — alt texts not yet translated |
| `owners-manual-japanese` | Japanese | CJK — alt texts not yet translated; only 59 images (vs ~254 in others) — possible missing content |

### Image alt texts
22 unique image alt texts appear across all editions. Non-English editions should have translated alt texts, not English fallbacks. As of June 2026:
- **Translated:** German, Spanish, Italian, Portuguese, Norwegian, Danish, Swedish, Finnish, Polish, Icelandic, Arabic, Turkish, French, Hebrew
- **Pending (CJK):** Korean, Chinese Traditional, Japanese

### Hebrew edition (RTL)
`owners-manual-hebrew/styles.css` has a dedicated RTL override block at the bottom. Key overrides:
- Sidebar: `right: 0` (not left)
- Main content: `margin-right: var(--sidebar-w)` (not margin-left)
- Callout/preamble accent bars: `border-right` (not border-left)
- Nav indentation: `padding-right` (not padding-left)
- Mobile sidebar: slides out to the right (`translateX(100%)`)

## GitHub Actions Workflows

Three workflows in `.github/workflows/`:

### `validate-manuals.yml`
Runs on every push/PR touching `owners-manual-*/index.html`. Checks:
- Exactly 1 `<!DOCTYPE html>` per file
- Exactly 1 `<main class="main-content"` opening tag
- Matching `</main>` closing tag
- Warns if English alt texts remain in non-English editions

### `translate-alt-texts.yml`
Runs on push to `main` (manual files) or via `workflow_dispatch`. Uses Claude Haiku (`claude-haiku-4-5-20251001`) to auto-translate English alt text fallbacks. Requires `ANTHROPIC_API_KEY` GitHub secret — **not yet added as of June 2026**. Skips CJK editions (Korean, Chinese Traditional).

### `deploy-notify.yml`
Runs on every push to `main`. Waits 90s for Netlify, then smoke-checks HTTP status of windrose.ai and 4 spot-check manual pages. Posts summary to GitHub Actions job summary.

## E700 Truck BOM & Supplier Map

The E700 truck Bill of Materials is tracked in Google Sheets (requires Windrose Google login):
**https://docs.google.com/spreadsheets/d/1VWscb-AHY1bAsdrS4uFOULbo0HWtVRLroe5JR_kQoKE/edit?usp=sharing**

The sheet contains: part numbers, supplier names, quantities per vehicle, and unit prices.

An interactive supplier map artifact (HTML, self-contained) lives in the scratchpad of session `ef157706-c30c-5f0c-bead-548858096446` at:
`/tmp/claude-0/-home-user-Windrose-website/ef157706-c30c-5f0c-bead-548858096446/scratchpad/supplier-map.html`

Published artifact URL: `https://claude.ai/code/artifact/98a10ab4-012f-4cec-80a1-b1977bcd91b3`

### Artifact features (as of June 2026)
- **By Taxonomy** tab: 3-level QC/T 25 accordion (系 → 总成 → parts), collapsible, with system filter tally cards
- **By Supplier** tab: pivot view — one collapsible card per supplier sorted by part count descending, "No Supplier Assigned" group at bottom; all cards collapsed by default; search works across both views

### BOM data notes (as of June 2026)
- Source JS: `tparts_slim.js` — 644 part entries (QC/T 25-2014 taxonomy)
- NMC/NCM battery entries removed: 2101001, 2101500, 2101600 — Windrose uses LFP only
- 154 of 644 entries have no supplier (`ss` field absent)
- No-supplier breakdown by 系: 系1:1, 系2:24, 系3:69, 系4:9, 系5:15, 系6:3, 系7:15, 系8:18
- Notable unsourced parts: 3506800 (relay valve), 3512020 (safety valve), 3600200 (lighting controller), 3703500 (DC converter), 7900500 (AR-HUD), 2107110 (CCS1 charging cable — US market), 8210101/8210201 (physical exterior mirrors — US market)
- Quantities and full pricing require the Google Sheet above — TPARTS data has prices for ~30% of entries only

### Pending data to add to artifact
Google Sheets is inaccessible from the remote execution environment (datacenter IP blocked by Google — 403 on all export URLs regardless of sharing settings). To add the following, the user must export the relevant sheet tab as CSV and paste it into chat:
- **Unit price per supplier × part** (单价) — to replace/supplement TPARTS partial pricing
- **开发费 + 模具费 per supplier** (development fee + tooling/mold fee) — lump-sum figures negotiated per supplier deal; not in TPARTS data at all

## Past structural issues (fixed June 2026)
These were repaired — do not reintroduce:
- Missing `<main>` wrapper: EU, UK, AU had `</section>` instead
- Concatenated HTML files: Danish (5 docs), Dutch (5), Chinese Traditional (3), Japanese (2)
- Premature `</main></body></html>` mid-document: German, Portuguese, Finnish, Polish, Icelandic, Korean
- Missing preamble ("Dear Customer" opening): EU, UK, AU were missing it; all others had it
