# Windrose Website — Claude Code Context

## Stack
- Static HTML site hosted on **Netlify**; auto-deploys on push to `main`
- `netlify.toml`: `publish = "."`, `functions = "netlify/functions"`
- GitHub repo: `git@github.com:Windrose-Electric/Windrose-website.git`
- Always use `target="_blank" rel="noopener"` on external links; never link to internal `/press/` pages — always use external windrose.ai URLs

## Security Rules (NEVER MODIFY)
- `_redirects` rule `/legal/*    /404    404` must remain — blocks all public web access to `/legal/`
- BCA drafts are marked "STRICTLY CONFIDENTIAL — DRAFT FOR DISCUSSION PURPOSES ONLY / NOT FOR DISTRIBUTION"
- Legal files must stay inaccessible from the public website

## Corporate Structure (as of 2 July 2026)

**TopCo:** Windrose Holdings Limited (Belgium N.V.) — BE 1017.756.464

**Western Branch (under TopCo):**
- Windrose Electric USA Inc. — Delaware (NYSE: WDRS); renamed from Windrose Technology Inc. on 6 June 2026
  - Windrose Technology B.V. — Netherlands (100%)
  - Windrose Technology Antwerp N.V. — Belgium (100%)
  - Windrose HK Holdings Limited — Hong Kong (100%)
  - Windrose Australia Pty Ltd — Australia (100%)

**Eastern Branch (under TopCo):**
- Shanghai Windrose Automotive Technology Co., Ltd. — China (100%)
  - Anhui Windrose Holdings Co., Ltd.
  - Anhui Windrose Technology Co., Ltd.
  - Shanghai Shenlan Technology Co., Ltd.
  - Jiangsu Swell Industrial Development Co., Ltd.

**HCIC VIII De-SPAC (investing at Closing):**
- HCIC VIII Shareholders — 24,150,000 Class B shares, Trust ~$241.5M
- HC VIII Sponsor LLC (Nevada) — 8,910,429 Class B shares

**BCA:** v0.13, signed 29 June 2026 · Exchange Ratio 1.0000 · Pre-Money $1,385,655,370
**Share classes:** Class A (20 votes/share, Founder) · Class B (1 vote/share, public/HCIC)

## Google Drive

**Windrose US Dataroom folder ID:** `1Z2VjG8BKH8v7awSw98Vo044G8Q3PepSh`
- Folder: "01. Windrose US🇺🇸 - 2026.06 dataroom"
- Org chart saved here as "2026.07.02 Windrose Group Structure"

**Files to delete manually (no MCP delete tool):**
- BCA v0.12 Part 1: `1EyJBw0_hrcABJUm4Hbsi0wuynlc2WZwm`
- BCA v0.12 Part 2: `1-d-X7TMcvKwq5cEcqCRI5GVB5yYIeLvN`
- BCA v0.11 Part 1: `1Br5807791eJLX-NHrPTq7ftUjd5EBWMz`
- BCA v0.11 Part 2: `1YD_fZ9hr3YVy-X421-6B5Bm4vNtfZnnWDni`

## Org Chart Artifact
Published at: `https://claude.ai/code/artifact/7d50045b-a855-42be-a79b-df707aa80435`

## Pending Items
- BCA v0.13 still references "Windrose Technology Inc." — needs update to "Windrose Electric USA Inc."

---

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

## Past structural issues (fixed June 2026)
These were repaired — do not reintroduce:
- Missing `<main>` wrapper: EU, UK, AU had `</section>` instead
- Concatenated HTML files: Danish (5 docs), Dutch (5), Chinese Traditional (3), Japanese (2)
- Premature `</main></body></html>` mid-document: German, Portuguese, Finnish, Polish, Icelandic, Korean
- Missing preamble ("Dear Customer" opening): EU, UK, AU were missing it; all others had it
