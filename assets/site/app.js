/* ============================================================
   STATIC — single-page app. Vanilla JS, hash router.
   Principle: scannable surface, deep core; few taps in, one tap out.
   ============================================================ */
(function () {
  'use strict';

  var DATA = window.STATIC_DATA || { chapters: [], behaviors: [], differentials: [], strategies: [], scenarios: [] };
  var app = document.getElementById('app');
  var hereLabel = document.getElementById('hereLabel');
  var backBtn = document.getElementById('backBtn');
  var tabbar = document.getElementById('tabbar');

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  // minimal inline markdown: **bold**, *italic*, `code`
  function inline(s) {
    var t = esc(s);
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');
    t = t.replace(/`([^`]+)`/g, '<code class="mono">$1</code>');
    return t;
  }
  function blocks(arr) {
    if (!arr) return '';
    return arr.map(function (b) {
      if (b.type === 'ul') {
        return '<ul class="bullets">' + b.items.map(function (i) { return '<li>' + inline(i) + '</li>'; }).join('') + '</ul>';
      }
      return '<p>' + inline(b.text) + '</p>';
    }).join('');
  }
  function ul(items, cls) {
    if (!items || !items.length) return '';
    return '<ul class="' + (cls || 'bullets') + '">' + items.map(function (i) { return '<li>' + inline(i) + '</li>'; }).join('') + '</ul>';
  }
  function ol(items) {
    if (!items || !items.length) return '';
    return '<ol class="steps">' + items.map(function (i) { return '<li>' + inline(i) + '</li>'; }).join('') + '</ol>';
  }
  function disc(label, body, open) {
    return '<details class="disc"' + (open ? ' open' : '') + '><summary>' + esc(label) +
      '<span class="chev" aria-hidden="true">›</span></summary><div class="disc__body">' + body + '</div></details>';
  }
  function find(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }

  /* ---------- router ---------- */
  // Back must behave predictably — it is the audience's escape promise.
  // Depth is read from history.state, not a hand-rolled counter that desyncs.
  var HOME_FALLBACK = '#/board';
  var lastDepth = 0;
  var firstRender = true;
  function navDepthNow() { return (history.state && typeof history.state.d === 'number') ? history.state.d : 0; }
  var routes = []; // {re, names, fn}
  function route(pattern, fn) {
    var names = [];
    var re = '^#' + pattern.replace(/:[a-z]+/g, function (m) { names.push(m.slice(1)); return '([^/]+)'; }) + '$';
    routes.push({ re: new RegExp(re), names: names, fn: fn });
  }

  function currentArea(hash) {
    if (hash.indexOf('#/mechanics') === 0 || hash.indexOf('#/cup') === 0) return 'mechanics';
    if (hash.indexOf('#/strategies') === 0) return 'strategies';
    if (hash.indexOf('#/behaviors') === 0 || hash.indexOf('#/differentials') === 0 ||
        hash.indexOf('#/scenarios') === 0 || hash.indexOf('#/explore') === 0) return 'explore';
    if (hash.indexOf('#/board') === 0 || hash.indexOf('#/patterns') === 0 ||
        hash.indexOf('#/profile') === 0 || hash.indexOf('#/principles') === 0 || hash.indexOf('#/about') === 0) return 'board';
    return 'home';
  }

  function render() {
    var hash = location.hash || '#/';
    var view = null, params = {};
    for (var i = 0; i < routes.length; i++) {
      var m = hash.match(routes[i].re);
      if (m) {
        routes[i].names.forEach(function (n, idx) { params[n] = decodeURIComponent(m[idx + 1]); });
        view = routes[i].fn;
        break;
      }
    }
    if (!view) view = viewNotFound;
    var out = view(params) || { title: 'Static', html: '' };

    app.innerHTML = out.html;
    hereLabel.textContent = out.here || 'Static';
    hereLabel.setAttribute('href', out.up || '#/');

    // back button: enabled when we have app history depth
    backBtn.disabled = navDepthNow() <= 0;

    // tabs current
    var area = currentArea(hash);
    [].forEach.call(tabbar.querySelectorAll('.tab'), function (t) {
      if (t.getAttribute('data-tab') === area) t.setAttribute('aria-current', 'page');
      else t.removeAttribute('aria-current');
    });

    // scroll + move focus to the new page heading so SR and keyboard users are
    // told where they are. Skip on first paint so the skip-link stays reachable.
    window.scrollTo(0, 0);
    if (!firstRender) {
      var heading = app.querySelector('h1');
      if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
      else { app.focus({ preventScroll: true }); }
    }
    firstRender = false;
    if (out.onMount) out.onMount();
  }

  window.addEventListener('hashchange', function () {
    // A fresh forward navigation arrives with no state — stamp it one level deeper.
    // Returning to an existing entry already carries its depth, so leave it alone.
    if (!history.state || typeof history.state.d !== 'number') {
      history.replaceState({ d: lastDepth + 1 }, '');
    }
    lastDepth = navDepthNow();
    render();
  });
  backBtn.addEventListener('click', function () {
    if (navDepthNow() > 0) { history.back(); }
    else { location.hash = HOME_FALLBACK; }
  });

  /* ============================================================
     VIEWS
     ============================================================ */

  /* ---------- HOME ---------- */
  function viewHome() {
    var doors = [
      { mark: 'A', t: 'I have been exhausted for years', d: 'and no single thing explains it', go: '#/mechanics/capacity-model' },
      { mark: 'B', t: 'Something clicked recently', d: 'and I want to understand the machine', go: '#/board' },
      { mark: 'C', t: 'I want to understand someone', d: 'whose nervous system runs differently', go: '#/explore' },
      { mark: 'D', t: 'I have a name for it now', d: 'and I need it to be concrete', go: '#/mechanics' }
    ];
    var html =
      '<div class="view hero">' +
        '<div class="stagger">' +
          '<span class="kicker">A mechanical guide · autistic &amp; AuDHD</span>' +
          '<h1 class="hero__title">STAT<span class="glitch">I</span>C</h1>' +
          '<p class="hero__sub">The signal is real. The gate is different. This is a calm, scannable field guide to how your nervous system actually works — and what helps.</p>' +
          '<p class="hero__scroll">Pick a door. Or open the <a href="#/board" style="color:var(--accent)">map</a>.</p>' +
        '</div>' +
      '</div>' +
      '<div class="view" style="padding-top:0">' +
        '<div class="grid stagger">' +
          doors.map(function (d) {
            return '<a class="door" href="' + d.go + '"><span class="door__mark">' + d.mark + '</span>' +
              '<span class="door__body"><h3>' + esc(d.t) + '</h3><p>' + esc(d.d) + '</p></span></a>';
          }).join('') +
        '</div>' +
        '<div class="footer-note">' +
          'Static is a pattern-recognition guide, not a diagnostic tool. ' +
          '<a href="#/principles">How this site is designed →</a>' +
        '</div>' +
      '</div>';
    return { html: html, here: 'Static', up: '#/' };
  }

  /* ---------- PRINCIPLES ---------- */
  function viewPrinciples() {
    var ps = [
      ['Scannable surface, deep core', 'Every screen leads with one plain truth and scannable cards. Detail is always one tap underneath — never the first thing you see.'],
      ['Few taps in, one tap out', 'Reaching the core of an idea takes two or three taps. Leaving takes one — a back control and a route home are always in the same place.'],
      ['Progressive disclosure', 'Depth stays collapsed until you ask for it. You control the density. Nobody carries more than they came for.'],
      ['Predictable structure', 'Every chapter, card, and strategy uses the same shape. Learn the pattern once; never spend working memory re-learning it.'],
      ['Interest-led navigation', 'No forced sequence. The Map is all entry points. Follow the thread that has your attention — monotropism is the design, not the problem.'],
      ['Low sensory load', 'Dark, warm, quiet. No autoplay, no sound, no surprise motion. Animation is subtle and removed entirely under reduced-motion.'],
      ['Always show where you are', 'Signal tags, section labels, clear exits. You should never have to hold your location in your head.'],
      ['Tools visualise, never test', 'The Cup and the Sensory Profile make invisible load visible. No score, no label, no severity, no diagnosis.'],
      ['Direct language', 'Mechanical and precise. It explains why, then points at what helps. No validation theatre, no pathologising.'],
      ['Works depleted, offline, on a phone', 'Static, private, fast, keyboard- and screen-reader friendly. Built for someone in overload on a train with one bar.']
    ];
    var html =
      '<div class="view">' +
        '<span class="kicker">How this is built</span>' +
        '<h1 style="font-size:var(--step-3);margin-bottom:var(--s3)">Design principles</h1>' +
        '<p class="lede">This guide is read by autistic and AuDHD adults who want deep focus on what grabs them — organised, scannable, and easy to escape. Ten principles encode that.</p>' +
        '<div class="stack" style="margin-top:var(--s5)">' +
          ps.map(function (p, i) {
            return '<div class="card"><div class="card__sub mono" style="color:var(--accent)">' + (i + 1 < 10 ? '0' : '') + (i + 1) + '</div>' +
              '<h3 class="card__title">' + esc(p[0]) + '</h3><p style="margin:0;color:var(--ink-soft)">' + esc(p[1]) + '</p></div>';
          }).join('') +
        '</div>' +
        '<div class="footer-note">These ten principles shape every screen you read here. <a href="#/about">More about this project →</a></div>' +
      '</div>';
    return { html: html, here: 'Principles', up: '#/board' };
  }

  /* ---------- BOARD (hub) ---------- */
  function viewBoard() {
    var channels = [
      { sig: 'Sensory', t: 'The Input', d: 'Why the world arrives louder. Filtering, habituation, the leaky gate.', go: '#/mechanics/sensory-processing', n: '' },
      { sig: 'Processing', t: 'Manual Mode', d: 'Social, executive, and emotional systems running deliberately, not automatically.', go: '#/mechanics', n: '3 chapters' },
      { sig: 'Load', t: 'The Capacity Model', d: 'Why small things cause big reactions — and what is actually accumulating.', go: '#/mechanics/capacity-model', n: '' },
      { sig: 'Output', t: 'Masking', d: 'What you do when you perform neurotypical, and what it costs over time.', go: '#/mechanics/masking-mechanics', n: '' },
      { sig: 'Recovery', t: 'Strategies', d: 'The operating manual: what helps, by challenge type, in three tiers.', go: '#/strategies', n: DATA.strategies.length + ' cards' }
    ];
    var areas = [
      { t: 'Mechanics', d: 'The six core chapters', go: '#/mechanics', n: DATA.chapters.length },
      { t: 'The Cup', d: 'Watch capacity fill & drain', go: '#/cup', n: '◴' },
      { t: 'Sensory Profile', d: 'Map your own 8 channels', go: '#/profile', n: '◈' },
      { t: 'Behaviours', d: 'Behaviour → mechanism cards', go: '#/behaviors', n: DATA.behaviors.length },
      { t: 'Differentials', d: 'Autism vs ADHD, anxiety, trauma', go: '#/differentials', n: DATA.differentials.length },
      { t: 'Scenarios', d: 'Worked real-life examples', go: '#/scenarios', n: DATA.scenarios.length }
    ];
    var html =
      '<div class="view view--wide">' +
        '<span class="kicker kicker--signal">Signal board</span>' +
        '<h1 style="font-size:var(--step-3);margin-bottom:var(--s2)">The map</h1>' +
        '<p class="lede">Five channels. Start anywhere — every page stands on its own.</p>' +
        '<div class="grid stagger" style="margin-top:var(--s4)">' +
          channels.map(function (c) {
            return '<a class="channel" href="' + c.go + '">' +
              (c.n ? '<span class="channel__count">' + esc(c.n) + '</span>' : '') +
              '<span class="channel__sig">' + esc(c.sig) + '</span>' +
              '<h3>' + esc(c.t) + '</h3><p>' + esc(c.d) + '</p></a>';
          }).join('') +
        '</div>' +
        '<div class="section"><div class="section__head"><h2>Everything</h2><a class="card__sub" href="#/about">About →</a></div>' +
        '<div class="grid grid--2">' +
          areas.map(function (a) {
            return '<a class="card card--link" href="' + a.go + '"><span class="arrow" aria-hidden="true">›</span>' +
              '<span class="card__sub">' + esc(String(a.n)) + '</span>' +
              '<h3 class="card__title">' + esc(a.t) + '</h3>' +
              '<p style="margin:0;color:var(--ink-mute);font-size:var(--step--1)">' + esc(a.d) + '</p></a>';
          }).join('') +
        '</div></div>' +
      '</div>';
    return { html: html, here: 'Map', up: '#/' };
  }

  /* ---------- MECHANICS list ---------- */
  function viewMechanics() {
    var html =
      '<div class="view">' +
        '<span class="kicker">Part 1 · Understanding the machine</span>' +
        '<h1 style="font-size:var(--step-3);margin-bottom:var(--s2)">Mechanics</h1>' +
        '<p class="lede">Six systems, six chapters. Each moves from “I experience this” to “I understand why” to “here is what helps.”</p>' +
        '<div class="stack stagger" style="margin-top:var(--s4)">' +
          DATA.chapters.map(function (c) {
            return '<a class="card card--link" href="#/mechanics/' + c.id + '">' +
              '<span class="arrow" aria-hidden="true">›</span>' +
              '<span class="numtag">' + (c.number < 10 ? '0' : '') + c.number + '</span> ' +
              '<span class="tag tag--signal" style="margin-left:.4rem;vertical-align:middle">' + esc(c.signal) + '</span>' +
              '<h3 class="card__title" style="margin-top:var(--s2)">' + esc(c.title) + '</h3>' +
              '<p style="margin:0;color:var(--ink-mute);font-size:var(--step--1)">' + esc(c.subtitle) + '</p></a>';
          }).join('') +
        '</div>' +
      '</div>';
    return { html: html, here: 'Mechanics', up: '#/board' };
  }

  /* ---------- CHAPTER ---------- */
  function viewChapter(p) {
    var c = find(DATA.chapters, p.id);
    if (!c) return viewNotFound();
    var idx = DATA.chapters.indexOf(c);
    var prev = DATA.chapters[idx - 1], next = DATA.chapters[idx + 1];

    // sections to surface vs to collapse
    var collapseHeads = /^(the chemistry|why it doesn'?t fade|why it varies|the bottleneck|the rules nobody|a note on|the flywheel|time and the internal|working memory|motivation and why|the adhd overlap|mistaken signals|the gender|the trap|hysteresis|the math of|the identity|the unmasking|threshold and overflow|the gap between)/i;

    var bodyHtml = '';
    var opening = c.sections.find(function (s) { return /^opening$/i.test(s.heading); });
    var truth = c.sections.find(function (s) { return /simple truth/i.test(s.heading); });
    var helps = c.sections.find(function (s) { return /what actually helps/i.test(s.heading); });
    var connects = c.sections.find(function (s) { return /what connects here/i.test(s.heading); });

    if (opening) bodyHtml += '<div class="prose">' + blocks(opening.blocks).replace('<p>', '<p class="first">') + '</div>';
    if (truth) bodyHtml += '<div class="truth">' + inline(c.simpleTruth) + '</div>';

    // remaining sections in order, skipping the special ones already placed / to be placed at end
    c.sections.forEach(function (s) {
      if (s === opening || s === truth || s === helps || s === connects) return;
      if (/^sources$/i.test(s.heading)) return;
      if (collapseHeads.test(s.heading)) {
        bodyHtml += disc(s.heading, blocks(s.blocks));
      } else {
        bodyHtml += '<div class="prose"><h3>' + esc(s.heading) + '</h3>' + blocks(s.blocks) + '</div>';
      }
    });

    if (connects) bodyHtml += '<div class="section"><h2 style="font-size:var(--step-2);margin-bottom:var(--s2)">What connects here</h2><div class="prose">' + blocks(connects.blocks) + '</div></div>';
    if (helps) bodyHtml += '<div class="section"><h2 style="font-size:var(--step-2);margin-bottom:var(--s2)">What actually helps</h2><div class="prose">' + blocks(helps.blocks) + '</div>' +
      '<a class="btn btn--accent" style="margin-top:var(--s3)" href="#/strategies">Open the strategy library ›</a></div>';

    // capacity chapter gets the cup CTA
    if (c.id === 'capacity-model') {
      bodyHtml = '<a class="card card--link" href="#/cup" style="margin-bottom:var(--s4)"><span class="arrow" aria-hidden="true">›</span><span class="card__sub">Interactive</span><h3 class="card__title">The Cup ◴</h3><p style="margin:0;color:var(--ink-mute);font-size:var(--step--1)">Watch your capacity fill and drain — no score, just the model made tangible.</p></a>' + bodyHtml;
    }

    var pager = '<div class="pager">' +
      (prev ? '<a href="#/mechanics/' + prev.id + '"><span class="lab">‹ Previous</span><span class="ttl">' + esc(prev.title) + '</span></a>' : '<a href="#/mechanics" style="opacity:.6"><span class="lab">‹</span><span class="ttl">All mechanics</span></a>') +
      (next ? '<a class="next" href="#/mechanics/' + next.id + '"><span class="lab">Next ›</span><span class="ttl">' + esc(next.title) + '</span></a>' : '<a class="next" href="#/strategies"><span class="lab">Next ›</span><span class="ttl">Strategies</span></a>') +
      '</div>';

    var html =
      '<div class="view">' +
        '<div class="crumb"><a href="#/mechanics">Mechanics</a> / Chapter ' + c.number + '</div>' +
        '<span class="kicker kicker--signal">' + esc(c.signal) + '</span>' +
        '<h1 style="font-size:var(--step-3);line-height:1;margin-bottom:var(--s2)">' + esc(c.title) + '</h1>' +
        '<p class="lede" style="margin-bottom:var(--s5)">' + esc(c.subtitle) + '</p>' +
        bodyHtml +
        pager +
      '</div>';
    return { html: html, here: 'Ch ' + c.number, up: '#/mechanics' };
  }

  /* ---------- STRATEGIES ---------- */
  var stratState = { cat: 'all', timing: 'all' };
  function viewStrategies() {
    var cats = ['all'].concat(uniq(DATA.strategies.map(function (s) { return s.category; })));
    var timings = ['all', 'Immediate', 'Preventive', 'Recovery'];

    function catChips() {
      return cats.map(function (c) {
        return '<button class="chip" data-cat="' + esc(c) + '" aria-pressed="' + (stratState.cat === c) + '">' + esc(c === 'all' ? 'All areas' : c) + '</button>';
      }).join('');
    }
    function timeChips() {
      return timings.map(function (t) {
        return '<button class="chip" data-timing="' + esc(t) + '" aria-pressed="' + (stratState.timing === t) + '">' + esc(t === 'all' ? 'Any time' : t) + '</button>';
      }).join('');
    }
    function isFiltered() { return stratState.cat !== 'all' || stratState.timing !== 'all'; }
    function filterSummary() {
      if (!isFiltered()) return 'Filter by area or timing';
      var parts = [];
      if (stratState.cat !== 'all') parts.push(stratState.cat);
      if (stratState.timing !== 'all') parts.push(stratState.timing);
      return 'Filtered · ' + parts.join(' · ');
    }
    function listHtml() {
      var items = DATA.strategies.filter(function (s) {
        return (stratState.cat === 'all' || s.category === stratState.cat) &&
               (stratState.timing === 'all' || (s.timing || []).indexOf(stratState.timing) !== -1);
      });
      var count = isFiltered() ? '<p class="muted mono" style="font-size:var(--step--1);margin-bottom:var(--s3)">' + items.length + ' of ' + DATA.strategies.length + ' shown</p>' : '';
      if (!items.length) return count + '<div class="empty">Nothing matches that combination. <button class="btn" id="resetFilters">Reset filters</button></div>';
      return count + '<div class="stack">' + items.map(stratCard).join('') + '</div>';
    }
    function stratCard(s) {
      var ev = s.evidence === 'Strong' ? 'strong' : s.evidence === 'Moderate' ? 'moderate' : 'emerging';
      var tags = (s.timing || []).map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') +
        '<span class="tag tag--' + ev + '">' + esc(s.evidence) + '</span>';
      var body =
        '<p>' + inline(s.what) + '</p>' +
        disc('Why it works', '<p>' + inline(s.mechanism) + '</p>') +
        (s.steps && s.steps.length ? disc('How to do it', ol(s.steps)) : '') +
        (s.bestFor && s.bestFor.length ? disc('Works best for', ul(s.bestFor)) : '') +
        (s.caveat ? '<p class="muted" style="font-size:var(--step--1);margin-top:var(--s3)"><span class="mono" style="color:var(--warn)">⚠ May not work if</span> ' + inline(s.caveat) + '</p>' : '');
      return '<div class="card"><span class="card__sub">' + esc(s.category) + '</span>' +
        '<h3 class="card__title" style="margin:var(--s1) 0 var(--s2)">' + esc(s.title) + '</h3>' +
        '<div class="chips" style="margin:0 0 var(--s3)">' + tags + '</div>' + body + '</div>';
    }

    var html =
      '<div class="view">' +
        '<span class="kicker">Part 3 · Operating manual</span>' +
        '<h1 style="font-size:var(--step-3);margin-bottom:var(--s2)">Strategies</h1>' +
        '<p class="lede">' + DATA.strategies.length + ' approaches. Each says what it is, why it works, and how to start. The full set is below; narrow it only if you want to.</p>' +
        '<details class="disc" id="stratFilters">' +
          '<summary><span id="filterSummary">' + esc(filterSummary()) + '</span><span class="chev" aria-hidden="true">›</span></summary>' +
          '<div class="disc__body">' +
            '<span class="kicker" style="margin-bottom:var(--s2)">By area</span>' +
            '<div class="chips" id="catChips" style="margin-top:0">' + catChips() + '</div>' +
            '<span class="kicker" style="margin-bottom:var(--s2)">By timing</span>' +
            '<div class="chips" id="timeChips" style="margin:0">' + timeChips() + '</div>' +
          '</div>' +
        '</details>' +
        '<div id="stratList" style="margin-top:var(--s4)">' + listHtml() + '</div>' +
      '</div>';

    function onMount() {
      var listEl = document.getElementById('stratList');
      var summaryEl = document.getElementById('filterSummary');
      document.getElementById('catChips').addEventListener('click', function (e) {
        var b = e.target.closest('[data-cat]'); if (!b) return;
        stratState.cat = b.getAttribute('data-cat');
        refreshPressed(); listEl.innerHTML = listHtml();
      });
      document.getElementById('timeChips').addEventListener('click', function (e) {
        var b = e.target.closest('[data-timing]'); if (!b) return;
        stratState.timing = b.getAttribute('data-timing');
        refreshPressed(); listEl.innerHTML = listHtml();
      });
      listEl.addEventListener('click', function (e) {
        if (e.target.id === 'resetFilters') { stratState.cat = 'all'; stratState.timing = 'all'; refreshPressed(); listEl.innerHTML = listHtml(); }
      });
      function refreshPressed() {
        [].forEach.call(document.querySelectorAll('[data-cat]'), function (b) { b.setAttribute('aria-pressed', stratState.cat === b.getAttribute('data-cat')); });
        [].forEach.call(document.querySelectorAll('[data-timing]'), function (b) { b.setAttribute('aria-pressed', stratState.timing === b.getAttribute('data-timing')); });
        if (summaryEl) summaryEl.textContent = filterSummary();
      }
    }
    return { html: html, here: 'Strategies', up: '#/board', onMount: onMount };
  }

  /* ---------- EXPLORE hub ---------- */
  function viewExplore() {
    var areas = [
      { t: 'Behaviour cards', d: 'Flip a behaviour to its neurological mechanism', go: '#/behaviors', n: DATA.behaviors.length },
      { t: 'Differential explorer', d: 'Autism vs ADHD, anxiety, trauma, sensory', go: '#/differentials', n: DATA.differentials.length },
      { t: 'Scenarios', d: 'Worked examples: what is happening, and the warning signs', go: '#/scenarios', n: DATA.scenarios.length },
      { t: 'Sensory profile', d: 'Map your own eight sensory channels', go: '#/profile', n: '◈' },
      { t: 'The Cup', d: 'See capacity fill and drain', go: '#/cup', n: '◴' }
    ];
    var html =
      '<div class="view">' +
        '<span class="kicker">Tools &amp; reference</span>' +
        '<h1 style="font-size:var(--step-3);margin-bottom:var(--s2)">Explore</h1>' +
        '<p class="lede">Reference material and interactive tools. Nothing here scores or diagnoses you.</p>' +
        '<div class="grid grid--2 stagger" style="margin-top:var(--s4)">' +
          areas.map(function (a) {
            return '<a class="card card--link" href="' + a.go + '"><span class="arrow" aria-hidden="true">›</span>' +
              '<span class="card__sub">' + esc(String(a.n)) + '</span>' +
              '<h3 class="card__title">' + esc(a.t) + '</h3>' +
              '<p style="margin:0;color:var(--ink-mute);font-size:var(--step--1)">' + esc(a.d) + '</p></a>';
          }).join('') +
        '</div>' +
      '</div>';
    return { html: html, here: 'Explore', up: '#/board' };
  }

  /* ---------- BEHAVIOURS (flip cards) ---------- */
  var behavState = { cat: 'all' };
  function viewBehaviors() {
    var cats = ['all'].concat(uniq(DATA.behaviors.map(function (b) { return b.category; })));
    function chips() {
      return cats.map(function (c) {
        return '<button class="chip" data-bcat="' + esc(c) + '" aria-pressed="' + (behavState.cat === c) + '">' + esc(c === 'all' ? 'All' : c) + '</button>';
      }).join('');
    }
    function cardHtml(b, i) {
      var back =
        '<p style="font-size:var(--step--1)">' + inline(b.mechanism) + '</p>' +
        (b.systems && b.systems.length ? '<p class="mono" style="font-size:0.66rem;color:var(--signal);margin-top:var(--s2)">' + b.systems.map(esc).join(' · ') + '</p>' : '');
      return '<button class="flip" data-flip aria-pressed="false" aria-label="' + esc(b.title) + ' — reveal the mechanism">' +
        '<span class="flip__inner">' +
          '<span class="flip__face flip__face--front" aria-hidden="false">' +
            '<span class="card__sub">' + esc(b.category) + '</span>' +
            '<h3 class="card__title" style="margin:var(--s1) 0 var(--s2)">' + esc(b.title) + '</h3>' +
            '<span style="display:block;color:var(--ink-soft);font-size:var(--step--1)">' + inline(b.observable) + '</span>' +
            '<span class="flip__hint">Tap for the mechanism ↻</span>' +
          '</span>' +
          '<span class="flip__face flip__face--back" aria-hidden="true">' +
            '<span class="card__sub" style="color:var(--signal)">Mechanism</span>' +
            '<h3 class="card__title" style="margin:var(--s1) 0 var(--s2);font-size:var(--step-0)">' + esc(b.title) + '</h3>' +
            back +
            '<span class="flip__hint">Tap to flip back ↺</span>' +
          '</span>' +
        '</span></button>';
    }
    function gridHtml() {
      var items = DATA.behaviors.filter(function (b) { return behavState.cat === 'all' || b.category === behavState.cat; });
      return '<div class="grid grid--2">' + items.map(cardHtml).join('') + '</div>';
    }
    var html =
      '<div class="view">' +
        '<div class="crumb"><a href="#/explore">Explore</a> / Behaviours</div>' +
        '<h1 style="font-size:var(--step-3);margin-bottom:var(--s2)">Behaviour cards</h1>' +
        '<p class="lede">The observable pattern on the front. The neurology on the back. Tap any card.</p>' +
        '<div class="chips" id="bchips">' + chips() + '</div>' +
        '<div id="bgrid">' + gridHtml() + '</div>' +
      '</div>';
    function onMount() {
      var grid = document.getElementById('bgrid');
      document.getElementById('bchips').addEventListener('click', function (e) {
        var b = e.target.closest('[data-bcat]'); if (!b) return;
        behavState.cat = b.getAttribute('data-bcat');
        [].forEach.call(document.querySelectorAll('[data-bcat]'), function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-bcat') === behavState.cat); });
        grid.innerHTML = gridHtml();
        bindFlips(grid);
      });
      bindFlips(grid);
    }
    return { html: html, here: 'Behaviours', up: '#/explore', onMount: onMount };
  }
  function bindFlips(scope) {
    [].forEach.call(scope.querySelectorAll('[data-flip]'), function (el) {
      // Keep the a11y tree in sync with the visible face — otherwise screen
      // readers hear the behaviour while sighted users see the mechanism.
      function setFlipped(next) {
        el.setAttribute('aria-pressed', String(next));
        var front = el.querySelector('.flip__face--front');
        var back = el.querySelector('.flip__face--back');
        if (front) front.setAttribute('aria-hidden', String(next));
        if (back) back.setAttribute('aria-hidden', String(!next));
      }
      el.addEventListener('click', function () { setFlipped(el.getAttribute('aria-pressed') !== 'true'); });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && el.getAttribute('aria-pressed') === 'true') setFlipped(false);
      });
    });
  }

  /* ---------- DIFFERENTIALS ---------- */
  function viewDifferentials() {
    var html =
      '<div class="view">' +
        '<div class="crumb"><a href="#/explore">Explore</a> / Differentials</div>' +
        '<h1 style="font-size:var(--step-3);margin-bottom:var(--s2)">Differential explorer</h1>' +
        '<p class="lede">Same surface, different mechanism. These compare autism to conditions it is often confused with — mechanistically, not as diagnosis.</p>' +
        '<div class="stack" style="margin-top:var(--s4)">' +
          DATA.differentials.map(function (d) {
            return '<a class="card card--link" href="#/differentials/' + d.id + '"><span class="arrow" aria-hidden="true">›</span>' +
              '<h3 class="card__title">' + esc(d.title) + '</h3>' +
              '<p style="margin:0;color:var(--ink-mute);font-size:var(--step--1)">' + esc(trim(d.overlap, 110)) + '</p></a>';
          }).join('') +
        '</div>' +
      '</div>';
    return { html: html, here: 'Differentials', up: '#/explore' };
  }
  function viewDifferential(p) {
    var d = find(DATA.differentials, p.id);
    if (!d) return viewNotFound();
    var distinct = (d.distinct || []);
    var splitHtml = distinct.length === 2 ?
      '<div class="split">' +
        '<div class="split__col split__col--a"><h4>' + esc(distinct[0].label) + '</h4><p>' + inline(distinct[0].body) + '</p></div>' +
        '<div class="split__col split__col--b"><h4>' + esc(distinct[1].label) + '</h4><p>' + inline(distinct[1].body) + '</p></div>' +
      '</div>' : '';
    var html =
      '<div class="view">' +
        '<div class="crumb"><a href="#/differentials">Differentials</a></div>' +
        '<h1 style="font-size:var(--step-2);margin-bottom:var(--s3)">' + esc(d.title) + '</h1>' +
        '<span class="kicker">Where they overlap</span>' +
        '<p>' + inline(d.overlap) + '</p>' +
        '<div class="section"><h2 style="font-size:var(--step-2);margin-bottom:var(--s3)">Distinct mechanisms</h2>' + splitHtml + '</div>' +
        (d.differentiators && d.differentiators.length ? '<div class="section"><h2 style="font-size:var(--step-2);margin-bottom:var(--s2)">Key differentiators</h2>' + ul(d.differentiators) + '</div>' : '') +
        disc('Why this matters', '<p>' + inline(d.matters) + '</p>') +
        disc('Can they co-occur?', '<p>' + inline(d.cooccur) + '</p>') +
      '</div>';
    return { html: html, here: 'Differential', up: '#/differentials' };
  }

  /* ---------- SCENARIOS ---------- */
  function viewScenarios() {
    var html =
      '<div class="view">' +
        '<div class="crumb"><a href="#/explore">Explore</a> / Scenarios</div>' +
        '<h1 style="font-size:var(--step-3);margin-bottom:var(--s2)">Scenarios</h1>' +
        '<p class="lede">Ordinary situations, read mechanically. What it looks like, what is happening underneath, and the warning signs.</p>' +
        '<div class="stack" style="margin-top:var(--s4)">' +
          DATA.scenarios.map(function (s) {
            return '<div class="card"><h3 class="card__title" style="margin-bottom:var(--s2)">' + esc(s.title) + '</h3>' +
              '<p style="color:var(--ink-soft);font-size:var(--step--1)">' + inline(s.situation) + '</p>' +
              disc('What is happening', '<p>' + inline(s.neuro) + '</p>') +
              (s.warnings && s.warnings.length ? disc('Warning signs', ul(s.warnings)) : '') +
              (s.variations && s.variations.length ? disc('Variations', ul(s.variations)) : '') +
              '</div>';
          }).join('') +
        '</div>' +
      '</div>';
    return { html: html, here: 'Scenarios', up: '#/explore' };
  }

  /* ---------- INTERACTIVE: THE CUP ---------- */
  function viewCup() {
    var fillers = [
      { t: 'Noisy environment', w: 15 }, { t: 'Forced eye contact / social performance', w: 18 },
      { t: 'Frequent task-switching', w: 12 }, { t: 'Masking all day', w: 20 },
      { t: 'Bright / flickering light', w: 10 }, { t: 'Unexpected change of plan', w: 14 },
      { t: 'Poor sleep last night', w: 12 }, { t: 'Physical pain or illness', w: 14 }
    ];
    var drainers = [
      { t: 'Time alone, no demands', w: -16 }, { t: 'Sensory rest (quiet, dark)', w: -14 },
      { t: 'Deep pressure / weighted blanket', w: -10 }, { t: 'Time in a special interest', w: -14 },
      { t: 'Unmasking with safe people', w: -12 }, { t: 'Real sleep', w: -18 }
    ];
    function row(item, drain) {
      return '<button class="toggle' + (drain ? ' drain' : '') + '" data-w="' + item.w + '" aria-pressed="false">' +
        '<span>' + esc(item.t) + '</span><span class="toggle__w">' + (item.w > 0 ? '+' : '') + item.w + '</span></button>';
    }
    var html =
      '<div class="view view--wide">' +
        '<div class="crumb"><a href="#/mechanics/capacity-model">Capacity model</a> / The Cup</div>' +
        '<h1 style="font-size:var(--step-3);margin-bottom:var(--s2)">The Cup</h1>' +
        '<p class="lede">Tap what your day held. Watch the cup fill. There is no score — this just makes the accumulation visible.</p>' +
        '<div class="cup-wrap" style="margin-top:var(--s5)">' +
          '<div><div class="cup"><div class="cup__fill" id="cupFill"></div><div class="cup__pct" id="cupPct">0%</div></div>' +
          '<div class="cup__label" id="cupMsg">Empty. A fresh start.</div></div>' +
          '<div>' +
            '<span class="kicker">Fills the cup</span><div class="toggle-list" id="fillers">' + fillers.map(function (f) { return row(f, false); }).join('') + '</div>' +
            '<span class="kicker kicker--signal" style="margin-top:var(--s4)">Drains the cup</span><div class="toggle-list" id="drainers">' + drainers.map(function (d) { return row(d, true); }).join('') + '</div>' +
            '<div class="btn-row"><button class="btn" id="cupReset">Reset</button></div>' +
          '</div>' +
        '</div>' +
        '<div class="footer-note">The trigger is never the cause. The cause is everything that came before it. <a href="#/mechanics/capacity-model">Read the model →</a></div>' +
      '</div>';
    function onMount() {
      var wrap = document.querySelector('.cup-wrap');
      var fill = document.getElementById('cupFill'), pct = document.getElementById('cupPct'), msg = document.getElementById('cupMsg');
      function recalc() {
        var total = 0;
        [].forEach.call(document.querySelectorAll('#fillers .toggle, #drainers .toggle'), function (t) {
          if (t.getAttribute('aria-pressed') === 'true') total += parseInt(t.getAttribute('data-w'), 10);
        });
        var v = Math.max(0, Math.min(130, total));
        var shown = Math.min(100, v);
        fill.style.height = shown + '%';
        pct.textContent = v + '%';
        if (v >= 100) { fill.classList.add('over'); msg.textContent = 'Overflow. Past here, a small trigger produces a large response.'; }
        else { fill.classList.remove('over');
          msg.textContent = v === 0 ? 'Empty. A fresh start.' : v < 40 ? 'Capacity to spare.' : v < 75 ? 'Filling up — running on reserves.' : 'Near the edge. Small things will feel big.';
        }
      }
      wrap.addEventListener('click', function (e) {
        var t = e.target.closest('.toggle'); if (!t) return;
        t.setAttribute('aria-pressed', t.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
        recalc();
      });
      document.getElementById('cupReset').addEventListener('click', function () {
        [].forEach.call(document.querySelectorAll('.toggle'), function (t) { t.setAttribute('aria-pressed', 'false'); });
        recalc();
      });
      recalc();
    }
    return { html: html, here: 'The Cup', up: '#/mechanics/capacity-model', onMount: onMount };
  }

  /* ---------- INTERACTIVE: SENSORY PROFILE ---------- */
  var AXES = ['Auditory', 'Visual', 'Tactile', 'Smell', 'Taste', 'Proprioceptive', 'Vestibular', 'Interoceptive'];
  var AXIS_CODES = ['AUD', 'VIS', 'TAC', 'SML', 'TAS', 'PRO', 'VES', 'INT'];
  function viewProfile() {
    var saved = loadProfile();
    function axisRow(name, i) {
      var v = saved[i] || 0;
      return '<div class="axis"><div class="axis__head"><span class="axis__name">' + esc(name) + '</span>' +
        '<span class="axis__val" data-val="' + i + '">' + valLabel(v) + '</span></div>' +
        '<input type="range" min="-3" max="3" step="1" value="' + v + '" data-axis="' + i + '" aria-label="' + esc(name) + ' sensitivity" aria-valuetext="' + esc(valText(v)) + '" />' +
        '<div class="axis__scale"><span>Hypo · seeks</span><span>Neutral</span><span>Hyper · floods</span></div></div>';
    }
    var html =
      '<div class="view">' +
        '<div class="crumb"><a href="#/explore">Explore</a> / Sensory profile</div>' +
        '<h1 style="font-size:var(--step-3);margin-bottom:var(--s2)">Sensory profile</h1>' +
        '<p class="lede">Set each channel from hypo-sensitive (seeking input) to hyper-sensitive (flooded). No labels, no severity — just the shape that is yours.</p>' +
        '<div class="radar-wrap" id="radarWrap">' + radarSvg(saved) + '</div>' +
        '<div id="axes" style="margin-top:var(--s4)">' + AXES.map(axisRow).join('') + '</div>' +
        '<div class="btn-row"><button class="btn" id="profReset">Reset to neutral</button><button class="btn btn--accent" id="profSave">Save on this device</button></div>' +
        '<div class="footer-note">Saved only in this browser. Nothing leaves your device. <a href="#/mechanics/sensory-processing">Why this varies →</a></div>' +
      '</div>';
    function onMount() {
      var axesEl = document.getElementById('axes');
      var wrap = document.getElementById('radarWrap');
      function vals() { return AXES.map(function (_, i) { var inp = axesEl.querySelector('[data-axis="' + i + '"]'); return parseInt(inp.value, 10); }); }
      axesEl.addEventListener('input', function (e) {
        var inp = e.target.closest('[data-axis]'); if (!inp) return;
        var i = +inp.getAttribute('data-axis');
        inp.setAttribute('aria-valuetext', valText(+inp.value));
        axesEl.querySelector('[data-val="' + i + '"]').textContent = valLabel(+inp.value);
        wrap.innerHTML = radarSvg(vals());
      });
      document.getElementById('profReset').addEventListener('click', function () {
        AXES.forEach(function (_, i) {
          var inp = axesEl.querySelector('[data-axis="' + i + '"]');
          inp.value = 0; inp.setAttribute('aria-valuetext', valText(0));
          axesEl.querySelector('[data-val="' + i + '"]').textContent = valLabel(0);
        });
        wrap.innerHTML = radarSvg(AXES.map(function () { return 0; }));
      });
      document.getElementById('profSave').addEventListener('click', function () {
        var ok = saveProfile(vals());
        var b = document.getElementById('profSave');
        b.textContent = ok ? 'Saved ✓' : "Couldn't save on this device";
        setTimeout(function () { b.textContent = 'Save on this device'; }, ok ? 1600 : 2600);
      });
    }
    return { html: html, here: 'Profile', up: '#/explore', onMount: onMount };
  }
  function valLabel(v) {
    if (v === 0) return 'neutral';
    var dir = v < 0 ? 'hypo' : 'hyper';
    return dir + ' ' + (Math.abs(v) === 3 ? '•••' : Math.abs(v) === 2 ? '••' : '•');
  }
  // Spoken equivalent of valLabel for screen readers (the dots read as nonsense).
  function valText(v) {
    if (v === 0) return 'neutral';
    var mag = Math.abs(v) === 3 ? 'strongly ' : Math.abs(v) === 2 ? 'moderately ' : 'mildly ';
    return v < 0 ? mag + 'hypo-sensitive, seeks input' : mag + 'hyper-sensitive, floods';
  }
  function radarSvg(vals) {
    var cx = 140, cy = 140, R = 110, n = AXES.length;
    function pt(i, r) {
      var a = (Math.PI * 2 * i / n) - Math.PI / 2;
      return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    }
    var rings = '';
    [0.33, 0.66, 1].forEach(function (f) {
      var p = AXES.map(function (_, i) { var xy = pt(i, R * f); return xy[0].toFixed(1) + ',' + xy[1].toFixed(1); }).join(' ');
      rings += '<polygon points="' + p + '" fill="none" stroke="rgba(240,237,232,0.10)" />';
    });
    var spokes = '', labels = '';
    AXES.forEach(function (name, i) {
      var xy = pt(i, R); spokes += '<line x1="' + cx + '" y1="' + cy + '" x2="' + xy[0].toFixed(1) + '" y2="' + xy[1].toFixed(1) + '" stroke="rgba(240,237,232,0.08)" />';
      var lp = pt(i, R + 16);
      var anchor = Math.abs(lp[0] - cx) < 6 ? 'middle' : (lp[0] < cx ? 'end' : 'start');
      labels += '<text x="' + lp[0].toFixed(1) + '" y="' + (lp[1] + 3).toFixed(1) + '" fill="#908a7e" font-size="10" letter-spacing="0.05em" font-family="IBM Plex Mono, monospace" text-anchor="' + anchor + '"><title>' + esc(name) + '</title>' + AXIS_CODES[i] + '</text>';
    });
    // value polygon: map -3..3 to 0.15..1 radius (neutral sits mid)
    var shape = vals.map(function (v, i) {
      var f = 0.18 + ((v + 3) / 6) * 0.82;
      var xy = pt(i, R * f); return xy[0].toFixed(1) + ',' + xy[1].toFixed(1);
    }).join(' ');
    return '<svg width="300" height="290" viewBox="-20 -5 320 290" role="img" aria-label="Sensory profile radar">' +
      rings + spokes +
      '<polygon points="' + shape + '" fill="rgba(245,166,35,0.18)" stroke="#f5a623" stroke-width="2" stroke-linejoin="round" />' +
      labels + '</svg>';
  }
  function loadProfile() {
    try { var s = JSON.parse(localStorage.getItem('static.profile') || '[]'); return Array.isArray(s) && s.length === AXES.length ? s : AXES.map(function () { return 0; }); }
    catch (e) { return AXES.map(function () { return 0; }); }
  }
  function saveProfile(v) { try { localStorage.setItem('static.profile', JSON.stringify(v)); return true; } catch (e) { return false; } }

  /* ---------- ABOUT ---------- */
  function viewAbout() {
    var html =
      '<div class="view">' +
        '<span class="kicker">About</span>' +
        '<h1 style="font-size:var(--step-3);margin-bottom:var(--s3)">What this is</h1>' +
        '<p class="lede">Static equips self-aware adults with a grounded, mechanical framework for turning overwhelming sensory, social, and energy demands into something they can actually act on.</p>' +
        '<div class="prose" style="margin-top:var(--s4)">' +
          '<h3>The approach</h3>' +
          '<p>Biological accuracy without unnecessary complexity. A concrete scenario grounding every concept. Direct language and no validation theatre. Reader agency in every application. You are already the expert on your own body — this is a set of structured mirrors and vocabulary.</p>' +
          '<h3>What it is not</h3>' +
          '<p>Not a diagnostic tool or clinical pathway. Not childhood-development guidance. Not medication or treatment advice. Not a debate about identity. The interactive tools visualise — they never score or diagnose.</p>' +
          '<h3>On evidence</h3>' +
          '<p>The content is distilled from deep research across sensory neuroscience, social cognition, executive function, interoception, allostatic load, and masking. Strategies are tagged by evidence strength — strong, moderate, or emerging — because the difference matters.</p>' +
        '</div>' +
        '<div class="grid grid--2" style="margin-top:var(--s5)">' +
          '<a class="card card--link" href="#/principles"><span class="arrow">›</span><h3 class="card__title">Design principles</h3><p class="muted" style="margin:0;font-size:var(--step--1)">How the site itself works</p></a>' +
          '<a class="card card--link" href="#/mechanics"><span class="arrow">›</span><h3 class="card__title">Start reading</h3><p class="muted" style="margin:0;font-size:var(--step--1)">The six mechanics chapters</p></a>' +
        '</div>' +
        '<div class="footer-note">Static is free and open. Built as a static site — private, fast, no tracking.</div>' +
      '</div>';
    return { html: html, here: 'About', up: '#/board' };
  }

  function viewNotFound() {
    return { html: '<div class="view"><div class="empty" style="padding-top:var(--s7)"><p>That page resolved to noise.</p><a class="btn btn--accent" href="#/board">Back to the map</a></div></div>', here: 'Lost', up: '#/board' };
  }

  /* ---------- small utils ---------- */
  function uniq(a) { var o = []; a.forEach(function (x) { if (o.indexOf(x) === -1) o.push(x); }); return o; }
  function trim(s, n) { s = s || ''; return s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '…' : s; }

  /* ---------- register routes ---------- */
  route('/', viewHome);
  route('/principles', viewPrinciples);
  route('/board', viewBoard);
  route('/mechanics', viewMechanics);
  route('/mechanics/:id', viewChapter);
  route('/strategies', viewStrategies);
  route('/explore', viewExplore);
  route('/behaviors', viewBehaviors);
  route('/differentials', viewDifferentials);
  route('/differentials/:id', viewDifferential);
  route('/scenarios', viewScenarios);
  route('/cup', viewCup);
  route('/profile', viewProfile);
  route('/patterns', viewProfile); // alias
  route('/about', viewAbout);

  // go
  if (!location.hash) location.replace('#/');
  // Stamp the entry point as depth 0 so Back is correctly disabled at the root.
  if (!history.state || typeof history.state.d !== 'number') {
    history.replaceState({ d: 0 }, '');
  }
  lastDepth = navDepthNow();
  render();
})();
