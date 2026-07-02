# Windrose Website — Claude Code Context

## Stack
- Static HTML site hosted on **Netlify**; auto-deploys on push to `main`
- `netlify.toml`: `publish = "."`, `functions = "netlify/functions"`
- GitHub repo: `git@github.com:Windrose-Electric/Windrose-website.git`
- Always use `target="_blank" rel="noopener"` on external links; never link to internal `/press/` pages — always use external windrose.ai URLs

## Artifacts / social previews
- Every time an artifact (Artifact tool page) is created or updated, also produce a **1200×630 social preview thumbnail** (OG standard size) as a separate PNG and send it to the user. Render a dedicated branded card (title + key figures + Windrose/苇渡 branding), not a full-page screenshot. Use the pre-installed Chromium via Playwright at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` (module at `/opt/node22/lib/node_modules/playwright`), viewport 1200×630, and clip to that box.

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
