/* =========================================================================
 * assets/js/chrome.js — header, navigation, language switcher and footer,
 * built at runtime so a wording or link fix applies without a rebuild.
 * ========================================================================= */
(function (root) {
  'use strict';

  var FM = root.FM = root.FM || {};
  var doc = root.document;

  function t(k) { return FM.i18n ? FM.i18n.t(k) : k; }
  function esc(s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function prefix() {
    var attr = doc && doc.documentElement ? doc.documentElement.getAttribute('data-root') : '';
    return attr || '';
  }

  /* Primary navigation. Every href here must exist — tools/check.js verifies it.
   * NAV_BAR = shown in the desktop header; NAV_MORE = drawer/MENU only (keeps the
   * top bar from colliding with langs / Translate / CTA). */
  /* Phase 0 honest nav (strict plan §6): Explore / How it works / Play.
   * Studio, Solutions, Supply-chain, Cases culled from primary nav — redirects
   * in vercel.json send old URLs to honest pages. No Login / dashboard /
   * thailand-pilot. Partner marketplace browser demoted; CTA stays become-a-partner. */
  var NAV_BAR = [
    { page: 'explore', href: 'explore/furi-monster.html', key: 'nav.explore', tier: 'core' },
    { page: 'how', href: 'how-it-works.html', key: 'nav.how', tier: 'core' },
    { page: 'play', href: 'play.html', key: 'nav.play', tier: 'mid' }
  ];
  var NAV_MORE = [];
  var NAV = NAV_BAR.concat(NAV_MORE);
  var UTIL = [
    { page: 'why', href: 'why-caracter.html', key: 'nav.why' },
    { page: 'about', href: 'about.html', key: 'nav.about' },
    { page: 'trust', href: 'trust.html', key: 'nav.trust' },
    { page: 'contact', href: 'contact.html', key: 'nav.contact' }
  ];

  function brandMark(kind) {
    var p = prefix();
    /* CATRACTER wordmark asset (logo file spelling); product copy stays CARACTER.
     * Image only — never pair with .brand-t text (causes ghost overlap in header). */
    if (kind === 'wordmark') {
      return '<img class="brand-logo" src="' + p + 'assets/img/brand/catracter-logo.png"' +
        ' srcset="' + p + 'assets/img/brand/catracter-logo.png 1x, ' + p + 'assets/img/brand/catracter-logo@2x.png 2x"' +
        ' width="160" height="30" alt="" decoding="async">';
    }
    return '<img class="mark mark--img" src="' + p + 'assets/img/brand/catracter-icon.png" width="32" height="32" alt="" decoding="async">';
  }

  function langSwitch(pfx) {
    var cur = FM.i18n ? FM.i18n.getLocale() : 'en';
    var ls = FM.i18n ? FM.i18n.locales : [{ id: 'en', label: 'EN' }];
    return '<div class="lang" role="group" aria-label="' + esc(t('a11y.lang')) + '">' +
      ls.map(l => '<button type="button" data-locale="' + l.id + '"' +
        (l.id === cur ? ' aria-pressed="true"' : ' aria-pressed="false"') +
        ' title="' + esc(l.name) + '">' + esc(l.label) + '</button>').join('') +
      '</div>';
  }

  function headerHtml() {
    var p = prefix();
    var page = doc.body.getAttribute('data-page') || '';
    return '<div class="wrap header-in">' +
      '<a class="brand" href="' + p + 'index.html" aria-label="CATRACTER">' + brandMark('wordmark') + '</a>' +
      '<nav class="nav" aria-label="Primary"><ul>' +
        NAV_BAR.map(n => '<li class="nav-item nav-item--' + (n.tier || 'core') + '"><a href="' + p + n.href + '"' +
          (n.page === page ? ' aria-current="page"' : '') + '>' + esc(t(n.key)) + '</a></li>').join('') +
      '</ul></nav>' +
      '<div class="tools">' +
        langSwitch(p).replace('class="lang"', 'class="lang lang--header"') +
        '<a class="btn btn--sm btn--primary header-cta hide-sm" href="' + p + 'partner/become-a-partner.html">' +
          esc(t('cta.collaborate')) + '</a>' +
        '<button class="btn btn--sm menu-btn" type="button" aria-expanded="false" aria-controls="ca-menu" aria-label="' +
          esc(t('a11y.menu')) + '">' +
          esc(t('nav.menu')) + '</button>' +
      '</div>' +
    '</div>';
  }

  function menuHtml() {
    var p = prefix();
    return '<div class="drawer" role="dialog" aria-modal="true" aria-label="' + esc(t('nav.menu')) + '">' +
      '<div class="drawer-panel">' +
        '<div class="drawer-top">' +
          '<span class="drawer-t">' + esc(t('nav.menu')) + '</span>' +
          '<button class="btn btn--sm drawer-close" type="button">' + esc(t('nav.close')) + '</button>' +
        '</div>' +
        '<div class="drawer-lang">' +
          langSwitch(p).replace('class="lang"', 'class="lang lang--drawer"') +
        '</div>' +
        '<nav class="drawer-nav"><ul>' +
          NAV.concat(UTIL).map(n => '<li><a href="' + p + n.href + '">' + esc(t(n.key)) + '</a></li>').join('') +
        '</ul></nav>' +
        '<a class="btn btn--primary drawer-cta" href="' + p + 'partner/become-a-partner.html">' +
          esc(t('cta.startCollaboration')) + '</a>' +
      '</div>' +
    '</div>';
  }

  function contactLineHtml(p) {
    var c = FM.config.contact || {};
    var bits = [];
    if (c.whatsappDisplay || c.whatsapp) {
      var wa = String(c.whatsapp || '').replace(/\D/g, '');
      var pre = '';
      try {
        pre = encodeURIComponent((c.whatsappPrefill && FM.i18n) ? FM.i18n.pick(c.whatsappPrefill) : (c.whatsappPrefill && c.whatsappPrefill.en) || '');
      } catch (e) { pre = ''; }
      bits.push('<a class="fbrand-chat" href="https://wa.me/' + esc(wa) + (pre ? '?text=' + pre : '') +
        '" target="_blank" rel="noopener noreferrer">WhatsApp ' + esc(c.whatsappDisplay || c.whatsapp) + '</a>');
    }
    if (c.wechatId || c.wechatName) {
      var wn = c.wechatName ? (FM.i18n ? FM.i18n.pick(c.wechatName) : (c.wechatName.en || c.wechatId)) : c.wechatId;
      bits.push('<span class="fbrand-chat">WeChat ' + esc(wn) + '</span>');
    }
    bits.push('<a class="fbrand-chat" href="' + p + 'contact.html">' + esc(t('nav.contact')) + '</a>');
    return bits.length ? '<p class="fbrand-chats">' + bits.join('<span class="fbrand-sep">·</span>') + '</p>' : '';
  }

  function footerHtml() {
    var p = prefix();
    function col(titleKey, items) {
      return '<div class="fcol"><h3>' + esc(t(titleKey)) + '</h3><ul>' +
        items.map(i => '<li><a href="' + p + i.href + '">' + esc(t(i.key)) + '</a></li>').join('') +
        '</ul></div>';
    }
    /* The group column must name the six groups, not repeat the nav label six
     * times — the first version pointed every entry at key 'nav.solutions' and
     * the footer read "Solutions / Solutions / Solutions…" on every page. */
    const groups = (FM.data && FM.data.groups) || [];
    /* Group names stay for orientation; link to Contact (interest), not fake /solutions/* pages. */
    function groupsCol() {
      return '<div class="fcol"><h3>' + esc(t('footer.groups')) + '</h3><ul>' +
        groups.map(g => '<li><a href="' + p + 'contact.html">' +
          esc(FM.i18n ? FM.i18n.pick(g.name) : g.slug) + '</a></li>').join('') +
        '</ul></div>';
    }

    return '<div class="wrap">' +
      '<div class="footer-grid">' +
        '<div class="fbrand">' + brandMark('wordmark') +
          '<p class="fbrand-t sr-only">CARACTER</p>' +
          '<p class="fbrand-s">' + esc(FM.i18n ? FM.i18n.pick(FM.config.tagline) : '') + '</p>' +
          '<p class="fbrand-c"><a href="mailto:' + esc(FM.config.contact.general) + '">' +
            esc(FM.config.contact.general) + '</a></p>' +
          contactLineHtml(p) +
        '</div>' +
        col('footer.platform', NAV) +
        groupsCol() +
        col('footer.company', UTIL) +
        col('footer.legal', [
          { href: 'legal/privacy.html', key: 'legal.privacy' },
          { href: 'legal/terms.html', key: 'legal.terms' },
          { href: 'legal/ai-notice.html', key: 'legal.ai' },
          { href: 'legal/licensing-policy.html', key: 'legal.licensing' }
        ]) +
      '</div>' +
      '<div class="footer-bottom">' +
        '<span>© ' + new Date().getFullYear() + ' CARACTER. ' + esc(t('footer.rights')) + '</span>' +
        '<span class="mono tiny">' + langSwitch(p).replace('class="lang"', 'class="lang lang--footer"') + '</span>' +
      '</div>' +
      '<p class="tiny muted fnote">' + esc(t('footer.domainNote')) + '</p>' +
      '<p class="tiny muted fnote">' + esc(t('footer.mtNotice')) + '</p>' +
    '</div>';
  }

  function mount() {
    var h = doc.getElementById('ca-header');
    var m = doc.getElementById('ca-menu');
    var f = doc.getElementById('ca-footer');
    if (h) { h.className = 'site-header'; h.innerHTML = headerHtml(); }
    if (m) { m.className = 'drawer-host'; m.innerHTML = menuHtml(); }
    if (f) { f.className = 'site-footer'; f.innerHTML = footerHtml(); }

    /* menu open / close */
    var btn = doc.querySelector('.menu-btn');
    var drawer = doc.querySelector('.drawer');
    var close = doc.querySelector('.drawer-close');
    function open(on) {
      if (!drawer || !btn) return;
      drawer.classList.toggle('is-open', on);
      btn.setAttribute('aria-expanded', String(on));
      doc.documentElement.classList.toggle('is-locked', on);
      if (on && close) close.focus();
    }
    if (btn) btn.addEventListener('click', function () { open(!drawer.classList.contains('is-open')); });
    if (close) close.addEventListener('click', function () { open(false); });
    if (drawer) drawer.addEventListener('click', function (e) {
      if (e.target === drawer) open(false);
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') open(false);
    });
  }

  FM.chrome = { mount: mount, prefix: prefix, esc: esc, NAV: NAV, NAV_BAR: NAV_BAR, NAV_MORE: NAV_MORE, UTIL: UTIL };

  if (doc) {
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', mount);
    else mount();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
