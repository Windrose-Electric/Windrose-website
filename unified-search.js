/* unified-search.js — Windrose smart search + AI assistant
 * Replaces inline gsSearch IIFEs on all pages.
 * Instant FAQ + page results while typing; press Enter for AI answer.
 */

// On page load: if arriving via a search-result click, skip the splash and scroll to section
(function () {
  var nav = sessionStorage.getItem('wr_search_nav');
  if (!nav) return;
  sessionStorage.removeItem('wr_search_nav');
  function skipSplash() {
    var splash = document.getElementById('wr-splash');
    if (splash) { splash.style.display = 'none'; document.body.style.overflow = ''; }
  }
  skipSplash();
  if (nav === 'top') return;
  function scrollToTarget() {
    skipSplash();
    var el = document.getElementById(nav);
    if (el) window.scrollTo({ top: Math.max(0, el.offsetTop - 120), behavior: 'instant' });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(scrollToTarget, 150); });
  } else {
    setTimeout(scrollToTarget, 150);
  }
})();

(function () {
  var GS_ACTIVE = -1;
  var GS_BOX    = null;
  var GS_ITEMS  = [];
  var GS_AI_CTL = null;
  var GS_LAST_Q = '';

  var FAQ_URL_MAP = {
    range:        './how-to-use.html#range-calc',
    price:        './how-to-buy.html#pricing',
    delivery:     './how-to-buy.html#pricing',
    order:        './how-to-buy.html#pricing',
    charge:       './how-to-use.html#charging',
    specs:        './technology.html',
    lease:        './how-to-buy.html#pricing',
    battery:      './technology.html',
    about:        './about-us.html',
    founder:      './about-us.html',
    investors:    './about-us.html#equity-investors-details',
    customers:    './about-us.html',
    countries:    './network.html',
    manufacturing:'./how-to-build.html#suppliers',
    service:      './how-to-service.html#locations',
    subsidies:    './how-to-buy.html#pricing',
    regulatory:   './technology.html#homologation',
    roadmap:      './roadmap.html',
    autonomy:     './technology.html',
    presentation: './presentation.html',
    press:        './press.html',
    time100:      './about-us.html'
  };
  window._FAQ_URLS = FAQ_URL_MAP;

  var LANG_NAMES = {
    en:'English', es:'Spanish', fr:'French', de:'German',
    zh:'Chinese (Simplified)', nl:'Dutch', no:'Norwegian',
    sv:'Swedish', fi:'Finnish', da:'Danish', pl:'Polish',
    it:'Italian', pt:'Portuguese', ja:'Japanese', ko:'Korean'
  };

  // Topic display order for the knowledge base
  var FAQ_TOPIC_ORDER = [
    'range','charge','battery','specs','price','lease','delivery','order',
    'subsidies','regulatory','about','founder','investors','customers',
    'countries','manufacturing','service','roadmap','autonomy',
    'presentation','press','time100'
  ];

  // Build a full system prompt from FAQ_LANGS — the single source of truth.
  // Includes all topics in the user's language (English fallback per topic).
  function buildSystemPrompt(langCode) {
    var faq    = window.FAQ_LANGS || {};
    var lang   = langCode || 'en';
    var langName = LANG_NAMES[lang] || 'English';
    var lines  = [];

    FAQ_TOPIC_ORDER.forEach(function (key) {
      var entry = faq[key];
      if (!entry) return;
      var text = entry[lang] || entry['en'];
      if (text) lines.push('[' + key.charAt(0).toUpperCase() + key.slice(1) + '] ' + text);
    });

    return 'You are the customer assistant for Windrose Electric, a global electric long-haul '
      + 'truck company headquartered in Antwerp, Belgium. Be concise, accurate, and warm. '
      + 'Keep answers under 80 words. Always respond in ' + langName + '.\n\n'
      + 'COMPLETE PRODUCT KNOWLEDGE (use ONLY this data — do not invent figures):\n\n'
      + lines.join('\n\n')
      + '\n\nFor anything not covered above, direct the user to sales@windrose.ai.';
  }

  function getBox() {
    if (GS_BOX) return GS_BOX;
    GS_BOX = document.createElement('div');
    GS_BOX.id = 'gs-results';
    GS_BOX.style.cssText = [
      'display:none', 'position:fixed', 'background:#0a1628',
      'border:1px solid rgba(74,158,255,0.3)',
      'border-radius:0 0 10px 10px',
      'max-height:520px', 'overflow-y:auto',
      'z-index:9999',
      'box-shadow:0 12px 40px rgba(0,0,0,0.8)'
    ].join(';');
    document.body.appendChild(GS_BOX);
    return GS_BOX;
  }

  function positionBox() {
    var inp = document.getElementById('gs-input');
    if (!inp) return;
    var r = inp.getBoundingClientRect();
    var box = getBox();
    box.style.top   = r.bottom + 'px';
    box.style.left  = r.left + 'px';
    box.style.width = Math.max(360, r.width) + 'px';
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function hl(text, q) {
    if (!q) return esc(text);
    var safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return esc(text).replace(new RegExp('(' + safe + ')', 'gi'),
      '<mark style="background:rgba(74,158,255,0.25);color:#e8f0ff;border-radius:2px;padding:0 2px;">$1</mark>');
  }

  function snippet(text, q, maxLen) {
    maxLen = maxLen || 160;
    var ql    = q.toLowerCase();
    var idx   = text.toLowerCase().indexOf(ql);
    var start = Math.max(0, idx - 60);
    var end   = Math.min(text.length, start + maxLen);
    var s = (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
    return hl(s, q);
  }

  function currentLang() {
    return ((window._currentLang || 'en') + '').replace(/_.*/, '');
  }

  function buildResultsHTML(q) {
    var ql = q.toLowerCase();
    GS_ITEMS = [];
    var html = '';

    // Section 1: FAQ answers
    var faq = window.FAQ_LANGS || {};
    var faqHits = [];
    Object.keys(faq).forEach(function (key) {
      if (key === 'fallback') return;
      var entry = faq[key];
      var lang  = currentLang();
      var ans   = entry[lang] || entry['en'] || '';
      if ((key + ' ' + ans).toLowerCase().indexOf(ql) >= 0) {
        faqHits.push({ key: key, ans: ans });
      }
    });

    function navOnclick(url) {
      var hi = url.indexOf('#');
      var section = hi >= 0 ? url.slice(hi + 1) : 'top';
      var curPage = location.pathname.split('/').pop() || 'index.html';
      var targetPage = (hi >= 0 ? url.slice(0, hi) : url).replace(/^\.\//, '');
      if (targetPage && targetPage !== curPage) {
        return ' onclick="sessionStorage.setItem(\'wr_search_nav\',\'' + section + '\')"';
      }
      return '';
    }

    if (faqHits.length) {
      html += '<div style="padding:0.4rem 1rem 0.2rem;font-family:Barlow Condensed,sans-serif;font-size:0.875rem;letter-spacing:0.12em;color:#4a9eff;border-bottom:1px solid rgba(74,158,255,0.12);">Quick Answers</div>';
      faqHits.slice(0, 3).forEach(function (hit) {
        var idx = GS_ITEMS.length;
        var url = FAQ_URL_MAP[hit.key] || '#';
        var trunc = hit.ans.length > 200 ? hit.ans.slice(0, 200) + '…' : hit.ans;
        GS_ITEMS.push({ u: url });
        html += '<a href="' + url + '"' + navOnclick(url) + ' data-idx="' + idx + '" style="display:block;padding:0.55rem 1rem;border-bottom:1px solid rgba(74,158,255,0.08);text-decoration:none;"'
          + ' onmouseover="this.style.background=\'rgba(74,158,255,0.08)\'" onmouseout="this.style.background=\'\';">'
          + '<div style="font-family:Barlow Condensed,sans-serif;font-size:0.875rem;letter-spacing:0.08em;color:#4a9eff;margin-bottom:0.2rem;">'
          + hl(hit.key.charAt(0).toUpperCase() + hit.key.slice(1), q) + '</div>'
          + '<div style="font-size:0.875rem;color:#c8d8f0;line-height:1.5;">' + snippet(trunc, q, 180) + '</div>'
          + '</a>';
      });
    }

    // Section 2: Page results
    var pages = window.SITE_SEARCH || [];
    var pageHits = pages.filter(function (r) {
      return (r.t + ' ' + (r.d || '') + ' ' + (r.p || '')).toLowerCase().indexOf(ql) >= 0;
    }).slice(0, faqHits.length ? 6 : 10);

    if (pageHits.length) {
      html += '<div style="padding:0.4rem 1rem 0.2rem;font-family:Barlow Condensed,sans-serif;font-size:0.875rem;letter-spacing:0.12em;color:#7a9abf;border-bottom:1px solid rgba(74,158,255,0.12);">'
        + (faqHits.length ? 'Pages' : 'Results') + '</div>';
      pageHits.forEach(function (r) {
        var idx = GS_ITEMS.length;
        GS_ITEMS.push({ u: r.u });
        html += '<a href="' + r.u + '"' + navOnclick(r.u) + ' data-idx="' + idx + '" style="display:block;padding:0.5rem 1rem;border-bottom:1px solid rgba(74,158,255,0.06);text-decoration:none;"'
          + ' onmouseover="this.style.background=\'rgba(74,158,255,0.08)\'" onmouseout="this.style.background=\'\';">'
          + '<div style="font-family:Barlow Condensed,sans-serif;font-size:0.875rem;letter-spacing:0.05em;color:#e8f0ff;line-height:1.3;">' + hl(r.t, q) + '</div>'
          + (r.p ? '<div style="font-size:0.875rem;color:#4a9eff;letter-spacing:0.06em;margin-top:1px;">' + r.p + '</div>' : '')
          + '</a>';
      });
    }

    return { html: html, hasHits: !!(faqHits.length || pageHits.length) };
  }

  function renderDropdown(q) {
    var box = getBox();
    GS_ACTIVE = -1;
    positionBox();

    var r = buildResultsHTML(q);
    var html = r.html;

    // "Ask AI" footer / no-results prompt
    var askBtn = '<button onclick="window.gsAskAI()" style="font-family:Barlow Condensed,sans-serif;font-size:0.8rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:0.3rem 0.8rem;background:rgba(74,158,255,0.22);border:1px solid rgba(74,158,255,0.55);border-radius:4px;color:#8ec8ff;cursor:pointer;transition:background .15s,color .15s,border-color .15s;" onmouseover="this.style.background=\'rgba(74,158,255,0.36)\';this.style.color=\'#b8daff\';this.style.borderColor=\'rgba(74,158,255,0.75)\'" onmouseout="this.style.background=\'rgba(74,158,255,0.22)\';this.style.color=\'#8ec8ff\';this.style.borderColor=\'rgba(74,158,255,0.55)\'">✦ Ask AI</button>';

    if (!r.hasHits) {
      box.innerHTML = '<div style="padding:0.75rem 1rem;display:flex;align-items:center;gap:0.8rem;flex-wrap:wrap;">'
        + '<span style="font-size:0.875rem;color:#7a9abf;font-family:DM Mono,monospace;">No results for &ldquo;' + esc(q) + '&rdquo;</span>'
        + askBtn
        + '</div>';
    } else {
      html += '<div style="padding:0.3rem 1rem 0.4rem;border-top:1px solid rgba(74,158,255,0.1);display:flex;align-items:center;gap:0.5rem;">'
        + '<span style="font-size:0.75rem;color:#4a6a8a;font-family:DM Mono,monospace;">or</span>'
        + askBtn
        + '</div>';
      box.innerHTML = html;
    }

    box.querySelectorAll('a[data-idx]').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        GS_ACTIVE = parseInt(el.getAttribute('data-idx'));
        box.querySelectorAll('a[data-idx]').forEach(function (a) {
          a.style.background = parseInt(a.getAttribute('data-idx')) === GS_ACTIVE
            ? 'rgba(74,158,255,0.12)' : '';
        });
      });
    });

    box.style.display = 'block';
  }

  window.gsSearch = function (q) {
    var box = getBox();
    q = (q || '').trim();
    if (!q) { box.style.display = 'none'; GS_ACTIVE = -1; GS_ITEMS = []; return; }
    GS_LAST_Q = q;
    renderDropdown(q);
  };

  window.gsAskAI = function () {
    var q = GS_LAST_Q;
    var inp = document.getElementById('gs-input');
    if (inp) q = inp.value.trim() || q;
    if (!q) return;
    showAIAnswer(q);
  };

  window.gsShowResults = function () {
    var q = GS_LAST_Q;
    var inp = document.getElementById('gs-input');
    if (inp && inp.value.trim()) q = inp.value.trim();
    if (!q) return;
    renderDropdown(q);
  };

  function mdToHtml(text) {
    // Convert **bold** to <strong> and *italic* to <em>, escape HTML first
    return esc(text)
      .replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#e8f4ff;">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  }

  function showAIAnswer(q) {
    var box = getBox();
    positionBox();

    // Replace box content entirely with AI answer + dismiss link
    var aiArea = '<div id="gs-ai-area" style="padding:0.7rem 1rem 0.8rem;">'
      + '<div style="font-family:Barlow Condensed,sans-serif;font-size:0.8rem;letter-spacing:0.12em;color:#4a9eff;margin-bottom:0.4rem;text-transform:uppercase;">AI Answer</div>'
      + '<div id="gs-ai-text" style="font-size:0.875rem;color:#c8d8f0;line-height:1.65;">'
      + '<span style="opacity:0.45;">Thinking…</span></div>'
      + '<div style="margin-top:0.5rem;">'
      + '<button onclick="window.gsShowResults()" style="font-family:Barlow Condensed,sans-serif;font-size:0.78rem;letter-spacing:0.06em;padding:0.2rem 0.55rem;background:none;border:1px solid rgba(74,158,255,0.2);border-radius:3px;color:#4a6a8a;cursor:pointer;">← Show page results</button>'
      + '</div>'
      + '</div>';

    box.innerHTML = aiArea;
    box.style.display = 'block';

    if (GS_AI_CTL) { try { GS_AI_CTL.abort(); } catch (e) {} }
    GS_AI_CTL = (typeof AbortController !== 'undefined') ? new AbortController() : null;

    // Detect language from query characters, fallback to page language
    var lang = currentLang();
    if (/[一-鿿]/.test(q)) lang = 'zh';
    else if (/[぀-ヿ]/.test(q)) lang = 'ja';
    else if (/[가-힣]/.test(q)) lang = 'ko';

    // Build system prompt from the single unified knowledge base (FAQ_LANGS)
    var system = buildSystemPrompt(lang);

    fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: GS_AI_CTL ? GS_AI_CTL.signal : undefined,
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 250,
        system: system,
        messages: [{ role: 'user', content: q }]
      })
    }).then(function (res) {
      return res.json();
    }).then(function (data) {
      var text = data.content && data.content[0] && data.content[0].text;
      if (!text) throw new Error('empty');
      var el = document.getElementById('gs-ai-text');
      if (el) el.innerHTML = mdToHtml(text);
    }).catch(function (err) {
      if (err && err.name === 'AbortError') return;
      var el = document.getElementById('gs-ai-text');
      if (el) el.textContent = 'For information, please email sales@windrose.ai';
    });
  }

  window.gsKey = function (e) {
    var box = getBox();
    var items = box.querySelectorAll('a[data-idx]');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      GS_ACTIVE = Math.min(GS_ACTIVE + 1, GS_ITEMS.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      GS_ACTIVE = Math.max(GS_ACTIVE - 1, 0);
    } else if (e.key === 'Enter') {
      if (GS_ACTIVE >= 0 && GS_ITEMS[GS_ACTIVE]) {
        window.location.href = GS_ITEMS[GS_ACTIVE].u;
        return;
      }
      // No result selected — ask AI
      e.preventDefault();
      window.gsAskAI();
      return;
    } else if (e.key === 'Escape') {
      window.gsClose();
      var inp = document.getElementById('gs-input');
      if (inp) inp.blur();
      return;
    }
    items.forEach(function (el) {
      el.style.background = parseInt(el.getAttribute('data-idx')) === GS_ACTIVE
        ? 'rgba(74,158,255,0.12)' : '';
    });
  };

  window.gsClose = function () {
    var box = GS_BOX;
    if (box) box.style.display = 'none';
    GS_ACTIVE = -1;
    if (GS_AI_CTL) { try { GS_AI_CTL.abort(); } catch (e) {} GS_AI_CTL = null; }
  };

  document.addEventListener('click', function (e) {
    // If the clicked element was removed from the DOM before this handler fires
    // (e.g. innerHTML was replaced inside the box), don't dismiss the box.
    if (!e.target.isConnected) return;
    var inp = document.getElementById('gs-input');
    var box = GS_BOX;
    if (inp && box && !inp.contains(e.target) && !box.contains(e.target)) {
      window.gsClose();
    }
  });
})();
