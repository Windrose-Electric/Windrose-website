(function () {
  var style = document.createElement('style');
  style.textContent = [
    /* Language selector in header */
    '.header-lang{display:flex;align-items:center;}',
    '.lang-select{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.25);',
    'color:#f0f4f8;font-size:13px;padding:5px 10px;border-radius:4px;cursor:pointer;',
    'max-width:220px;}',
    '.lang-select:hover{background:rgba(255,255,255,.18);}',
    '.lang-select:focus{outline:none;}',
    '.lang-select option{background:#1a2332;color:#f0f4f8;}',
    /* Collapsible group headers */
    'li.nav-group-header{pointer-events:auto!important;cursor:pointer;user-select:none;}',
    'li.nav-group-header span::before{content:"▾ ";font-size:9px;opacity:.7;}',
    'li.nav-group-header.collapsed span::before{content:"▸ ";}',
    'li.nav-chapter.grp-hidden{display:none!important;}',
    /* Chapter numbering via CSS counters — number prefix only, no extra arrow */
    '.nav-chapters{counter-reset:grp-ctr;}',
    'li.nav-group-header{counter-increment:grp-ctr;counter-reset:chap-ctr;}',
    'li.nav-chapter{counter-increment:chap-ctr;}',
    '.nav-chapter-title::before{content:counter(grp-ctr) "." counter(chap-ctr) " ▸"!important;font-size:11px;display:inline!important;}',
    '.nav-chapter-title:has(+.nav-sections.expanded)::before{content:counter(grp-ctr) "." counter(chap-ctr) " ▾"!important;transform:none!important;}',
    /* Collapsible body sections */
    'h1.sec-toggle,h2.sec-toggle{cursor:pointer;user-select:none;}',
    'h1.sec-toggle:hover,h2.sec-toggle:hover{color:var(--accent);}',
    'h1.sec-toggle::after,h2.sec-toggle::after{content:" ▸";font-size:11px;opacity:.5;font-weight:400;}',
    'h1.sec-toggle.is-open::after,h2.sec-toggle.is-open::after{content:" ▾";}',
    /* ── Content group accordion ───────────────────────────── */
    '.acc-grp{margin:20px 0 0;}',
    '.acc-grp:first-of-type{margin-top:8px;}',
    '.acc-grp-hdr{',
      'display:flex;align-items:center;gap:10px;',
      'width:100%;padding:13px 18px;',
      'background:#1a2332;color:#f0f4f8;',
      'border:none;border-radius:6px;',
      'text-align:left;cursor:pointer;font-family:inherit;',
      'font-size:14px;font-weight:700;letter-spacing:.01em;',
      'box-shadow:0 2px 6px rgba(0,0,0,.15);',
      'transition:background .15s;}',
    '.acc-grp-hdr:hover{background:#263c5a;}',
    '.acc-grp-hdr:focus-visible{outline:2px solid #4fa3ff;outline-offset:2px;}',
    '.acc-grp-num{',
      'font-family:ui-monospace,monospace;font-size:11px;font-weight:700;',
      'background:rgba(255,255,255,.15);color:#f0f4f8;',
      'padding:2px 8px;border-radius:3px;flex-shrink:0;letter-spacing:.06em;}',
    '.acc-grp-title{flex:1;}',
    '.acc-grp-arrow{',
      'font-size:10px;opacity:.65;flex-shrink:0;',
      'transition:transform .2s;}',
    '.acc-grp.open>.acc-grp-hdr .acc-grp-arrow{transform:rotate(90deg);}',
    '.acc-grp-body{display:none;padding:4px 0 4px;}',
    '.acc-grp.open>.acc-grp-body{display:block;}',
    /* Chapter headings inside a group — give them a left rail and hover */
    '.acc-grp-body .manual-section.level-1{',
      'border-bottom:1px solid #eee;',
      'border-left:3px solid transparent;',
      'padding-left:12px;',
      'transition:border-color .15s;}',
    '.acc-grp-body .manual-section.level-1:hover{border-left-color:#0b5ed7;}',
    /* sec-toggle (h1) already has styles; tighten inside groups */
    '.acc-grp-body h1.sec-toggle{margin:0;padding:14px 0 14px 4px;border-bottom:none;}',
    '.acc-grp-body .manual-section.level-1 .sec-body{padding-left:4px;}',
    /* ── Manual stats bar ── */
    '.manual-stats-bar{display:flex;align-items:center;gap:0;margin:0 0 20px;border-radius:8px;',
      'background:#111c2d;border:1px solid rgba(74,158,255,.15);overflow:hidden;}',
    '.manual-stat{flex:1;display:flex;flex-direction:column;align-items:center;',
      'padding:14px 10px;gap:2px;border-right:1px solid rgba(74,158,255,.12);}',
    '.manual-stat:last-child{border-right:none;}',
    '.manual-stat-value{font-size:1.45rem;font-weight:700;font-family:ui-monospace,monospace;',
      'color:#5aaeff;letter-spacing:-.01em;line-height:1;}',
    '.manual-stat-label{font-size:0.7rem;letter-spacing:.1em;text-transform:uppercase;',
      'color:rgba(160,200,255,.55);margin-top:2px;}',
  ].join('');
  document.head.appendChild(style);

  var EDITIONS = [
    { path: '/owners-manual-eu/',                  flag: '🇪🇺', label: 'European Union (EN)' },
    { path: '/owners-manual-uk/',                  flag: '🇬🇧', label: 'United Kingdom (EN)' },
    { path: '/owners-manual-us/',                  flag: '🇺🇸', label: 'United States (EN)' },
    { path: '/owners-manual-au/',                  flag: '🇦🇺', label: 'Australia — ADR Edition (EN)' },
    { path: '/owners-manual-australia/',           flag: '🇦🇺', label: 'Australia (EN)' },
    { path: '/owners-manual-german/',              flag: '🇩🇪', label: 'Deutschland (DE)' },
    { path: '/owners-manual-french/',              flag: '🇫🇷', label: 'France (FR)' },
    { path: '/owners-manual-spanish/',             flag: '🇪🇸', label: 'España (ES)' },
    { path: '/owners-manual-italian/',             flag: '🇮🇹', label: 'Italia (IT)' },
    { path: '/owners-manual-portuguese/',          flag: '🇵🇹', label: 'Portugal (PT)' },
    { path: '/owners-manual-dutch/',               flag: '🇳🇱', label: 'Nederland (NL)' },
    { path: '/owners-manual-swedish/',             flag: '🇸🇪', label: 'Sverige (SV)' },
    { path: '/owners-manual-norsk/',               flag: '🇳🇴', label: 'Norge (NO)' },
    { path: '/owners-manual-danish/',              flag: '🇩🇰', label: 'Danmark (DA)' },
    { path: '/owners-manual-finnish/',             flag: '🇫🇮', label: 'Suomi (FI)' },
    { path: '/owners-manual-polish/',              flag: '🇵🇱', label: 'Polska (PL)' },
    { path: '/owners-manual-icelandic/',           flag: '🇮🇸', label: 'Ísland (IS)' },
    { path: '/owners-manual-chinese-simplified/',  flag: '🇨🇳', label: '简体中文' },
    { path: '/owners-manual-chinese-traditional/', flag: '🇭🇰', label: '繁體中文' },
    { path: '/owners-manual-japanese/',            flag: '🇯🇵', label: '日本 (JA)' },
    { path: '/owners-manual-korean/',              flag: '🇰🇷', label: '한국 (KO)' },
    { path: '/owners-manual-arabic/',              flag: '🇦🇪', label: 'العربية (AR)' },
    { path: '/owners-manual-hebrew/',              flag: '🇮🇱', label: 'עברית (HE)' },
    { path: '/owners-manual-turkish/',             flag: '🇹🇷', label: 'Türkiye (TR)' },
  ];

  var currentPath = window.location.pathname.replace(/\/index\.html$/, '/');
  if (!currentPath.endsWith('/')) currentPath += '/';

  var sel = document.createElement('select');
  sel.className = 'lang-select';
  sel.setAttribute('aria-label', 'Select language edition');

  EDITIONS.forEach(function (ed) {
    var opt = document.createElement('option');
    opt.value = ed.path;
    opt.textContent = ed.flag + ' ' + ed.label;
    if (currentPath === ed.path) opt.selected = true;
    sel.appendChild(opt);
  });

  sel.addEventListener('change', function () {
    window.location.href = sel.value;
  });

  var wrapper = document.createElement('div');
  wrapper.className = 'header-lang';
  wrapper.appendChild(sel);

  function initSections() {
    document.querySelectorAll('.manual-section.level-1, .manual-section.level-2').forEach(function (sec) {
      var hd = sec.querySelector('h1, h2');
      if (!hd) return;
      var others = Array.from(sec.children).filter(function (el) { return el !== hd; });
      if (!others.length) return;
      var body = document.createElement('div');
      body.className = 'sec-body';
      body.hidden = true;
      others.forEach(function (el) { body.appendChild(el); });
      sec.appendChild(body);
      hd.classList.add('sec-toggle');
      hd.addEventListener('click', function () {
        body.hidden = !body.hidden;
        hd.classList.toggle('is-open', !body.hidden);
      });
    });
  }

  function injectStats() {
    var main = document.getElementById('mainContent');
    if (!main || document.getElementById('wr-manual-stats')) return;
    var sections = main.querySelectorAll('.manual-section.level-1:not(.preamble-section):not(.toc-section)').length;
    var photos   = main.querySelectorAll('img').length;
    var sizeKB   = Math.round(document.documentElement.outerHTML.length / 1024);
    var bar = document.createElement('div');
    bar.id = 'wr-manual-stats';
    bar.className = 'manual-stats-bar';
    bar.innerHTML =
      '<div class="manual-stat"><span class="manual-stat-value">' + sections + '</span><span class="manual-stat-label">sections</span></div>' +
      '<div class="manual-stat"><span class="manual-stat-value">' + photos + '</span><span class="manual-stat-label">photos</span></div>' +
      '<div class="manual-stat"><span class="manual-stat-value">' + sizeKB + ' KB</span><span class="manual-stat-label">document size</span></div>';
    main.insertBefore(bar, main.firstChild);
  }

  function expandForHash(hash) {
    if (!hash) return;
    var el = document.getElementById(hash.slice(1));
    if (!el) return;
    // Open containing acc-grp
    var grpBody = el.closest('.acc-grp-body');
    if (grpBody) {
      var grp = grpBody.closest('.acc-grp');
      if (grp && !grp.classList.contains('open')) {
        grp.classList.add('open');
        var hdr = grp.querySelector('.acc-grp-hdr');
        if (hdr) hdr.setAttribute('aria-expanded', 'true');
      }
    }
    var sec = el.closest('.manual-section') || (el.classList.contains('manual-section') ? el : null);
    if (!sec) return;
    // Open the section's own sec-body
    var body = sec.querySelector(':scope > .sec-body');
    if (body) {
      body.hidden = false;
      var hd = sec.querySelector(':scope > .sec-toggle');
      if (hd) hd.classList.add('is-open');
    }
    // Also expand parent level-1 section if this is a level-2
    var parent = sec.closest('.manual-section.level-1');
    if (parent && parent !== sec) {
      var pbody = parent.querySelector(':scope > .sec-body');
      if (pbody) {
        pbody.hidden = false;
        var phd = parent.querySelector(':scope > .sec-toggle');
        if (phd) phd.classList.add('is-open');
      }
    }
  }

  window.addEventListener('hashchange', function () { expandForHash(location.hash); });

  // Auto-expand the target section when any anchor link is clicked
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (href && href.length > 1) expandForHash(href);
  });

  document.addEventListener('DOMContentLoaded', function () {
    injectStats();

    // Inject edition selector into #manual-lang-row
    var wrap = document.getElementById('manual-edition-select-wrap');
    if (wrap) {
      wrap.appendChild(wrapper);
    } else {
      // Fallback for old site-header layout
      var header = document.querySelector('.site-header');
      if (header) header.appendChild(wrapper);
    }

    // Make nav-group-headers collapsible and collapse all by default
    var chapList = document.querySelector('.nav-chapters');
    if (chapList) {
      var headers = chapList.querySelectorAll('li.nav-group-header');
      headers.forEach(function (hdr) {
        hdr.addEventListener('click', function () {
          var collapsed = hdr.classList.toggle('collapsed');
          var sib = hdr.nextElementSibling;
          while (sib && !sib.classList.contains('nav-group-header')) {
            sib.classList.toggle('grp-hidden', collapsed);
            sib = sib.nextElementSibling;
          }
        });
        // Collapse this group immediately
        hdr.classList.add('collapsed');
        var sib = hdr.nextElementSibling;
        while (sib && !sib.classList.contains('nav-group-header')) {
          sib.classList.add('grp-hidden');
          sib = sib.nextElementSibling;
        }
      });
    }

    // ── Content group accordion ────────────────────────────────
    (function initGroupAccordion() {
      var main = document.getElementById('mainContent');
      if (!main) return;

      // Read group titles from nav sidebar (e.g. "1. Safety & Compliance")
      var groupTitles = {};
      document.querySelectorAll('li.nav-group-header span').forEach(function (el) {
        var text = el.textContent.trim();
        var m = text.match(/^(\d+)\./);
        if (m) groupTitles[m[1]] = text;
      });

      // Walk all sections in DOM order; collect level-1 chapters and their
      // following level-2 siblings so we can re-parent them before grouping.
      var chapters = []; // { el, groupNum, level2s[] }
      var curChapter = null;
      Array.from(main.querySelectorAll('.manual-section')).forEach(function (sec) {
        if (sec.classList.contains('preamble-section') || sec.classList.contains('toc-section')) return;
        if (sec.classList.contains('level-1')) {
          var lb = sec.querySelector('.sec-label');
          if (!lb) return;
          var m = lb.textContent.trim().match(/^(\d+)/);
          if (!m) return;
          curChapter = { el: sec, groupNum: m[1], level2s: [] };
          chapters.push(curChapter);
        } else if (sec.classList.contains('level-2') && curChapter) {
          curChapter.level2s.push(sec);
        }
      });

      if (!chapters.length) return;

      // Move each level-2 section inside its parent level-1 section so the
      // chapter accordion reveals sub-sections when expanded.
      chapters.forEach(function (ch) {
        ch.level2s.forEach(function (l2) { ch.el.appendChild(l2); });
      });

      // Build group map from chapters
      var groups = {}, groupOrder = [];
      chapters.forEach(function (ch) {
        var g = ch.groupNum;
        if (!groups[g]) { groups[g] = []; groupOrder.push(g); }
        groups[g].push(ch.el);
      });

      if (!groupOrder.length) return;

      groupOrder.forEach(function (g) {
        var secs = groups[g];
        var rawTitle = groupTitles[g] || (g + '.');
        // Split "1. Safety & Compliance" → num "1." and title "Safety & Compliance"
        var parts = rawTitle.match(/^(\d+\.\s*)(.*)/);
        var numPart  = parts ? parts[1].trim() : g + '.';
        var titlePart = parts ? parts[2] : rawTitle;

        var grpDiv = document.createElement('div');
        grpDiv.className = 'acc-grp';

        var btn = document.createElement('button');
        btn.className = 'acc-grp-hdr';
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML =
          '<span class="acc-grp-num">' + numPart + '</span>' +
          '<span class="acc-grp-title">' + titlePart + '</span>' +
          '<span class="acc-grp-arrow">&#9658;</span>';
        grpDiv.appendChild(btn);

        var body = document.createElement('div');
        body.className = 'acc-grp-body';
        grpDiv.appendChild(body);

        secs[0].parentNode.insertBefore(grpDiv, secs[0]);
        secs.forEach(function (s) { body.appendChild(s); });

        btn.addEventListener('click', function () {
          var open = grpDiv.classList.toggle('open');
          btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
      });

      // Expand the group (and optionally chapter) that contains a given element
      function expandToEl(el) {
        if (!el) return;
        // Open the containing acc-grp
        var grpBody = el.closest('.acc-grp-body');
        if (grpBody) {
          var grp = grpBody.closest('.acc-grp');
          if (grp && !grp.classList.contains('open')) {
            grp.querySelector('.acc-grp-hdr').click();
          }
        }
        // Open the level-1 sec-body that contains this element
        var l1sec = el.closest('.manual-section.level-1');
        if (l1sec) {
          var l1body = l1sec.querySelector(':scope > .sec-body');
          if (l1body && l1body.hidden) {
            var l1toggle = l1sec.querySelector(':scope > .sec-toggle');
            if (l1toggle) l1toggle.click();
          }
        }
        // If the target is a level-2 section (or inside one), also open its sec-body
        var isSelf = el.classList && el.classList.contains('manual-section') && el.classList.contains('level-2');
        var l2sec = isSelf ? el : el.closest('.manual-section.level-2');
        if (l2sec) {
          var l2body = l2sec.querySelector(':scope > .sec-body');
          if (l2body && l2body.hidden) {
            var l2toggle = l2sec.querySelector(':scope > .sec-toggle');
            if (l2toggle) l2toggle.click();
          }
        }
      }

      // Handle ALL internal links (sidebar nav, TOC, content cross-refs).
      // We register before the inline script so our handler fires first.
      // stopImmediatePropagation prevents: (a) the inline nav-chapter toggle
      // that calls e.preventDefault() without scrolling, and (b) the smooth-scroll
      // handler that would call scrollIntoView before the accordion has painted.
      // We replicate everything the inline smooth-scroll handler did:
      // expand group, push history, close mobile sidebar, then scroll after rAF.
      document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
          var id = (a.getAttribute('href') || '').slice(1);
          if (!id) return;
          var el = document.getElementById(id);
          if (!el) return;
          e.preventDefault();
          e.stopImmediatePropagation();
          expandToEl(el);
          if (a.classList.contains('nav-chapter-title')) {
            var ul = a.nextElementSibling;
            if (ul && ul.classList.contains('nav-sections') && ul.children.length > 0) {
              ul.classList.add('expanded');
            }
          }
          history.pushState(null, '', '#' + id);
          var sidebar = document.getElementById('sidebar');
          if (sidebar) sidebar.classList.remove('open');
          requestAnimationFrame(function () {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        });
      });

      // Hash changes (search results, direct links)
      window.addEventListener('hashchange', function () {
        expandToEl(document.getElementById(location.hash.slice(1)));
      });

      // initSections runs AFTER initGroupAccordion so level-2 sections have
      // already been moved inside their level-1 parents. This means collapsing
      // a level-1 section also hides its nested sub-sections.
      initSections();

      // Hash on page load — runs after initSections so collapsed sections open correctly
      if (location.hash) {
        expandToEl(document.getElementById(location.hash.slice(1)));
      }
    }());
  });
})();
