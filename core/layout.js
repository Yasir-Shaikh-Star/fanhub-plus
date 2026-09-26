const { icon } = require('./icons');
const { avatarArt } = require('./art');
const { Categories } = require('../models');
const requestContext = require('./requestContext');

const NOINDEX_PREFIXES = ['/login', '/register', '/forgot-password', '/reset-password', '/dashboard', '/profile', '/admin'];

function escHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const ASSET_VERSION = Date.now();

const NAV_LINKS = [
  { href: '/explore', label: 'Explore' },
  { href: '/characters', label: 'Characters' },
  { href: '/articles', label: 'Articles' },
  { href: '/merch', label: 'Merch' },
  { href: '/events', label: 'Events' },
  { href: '/feedback', label: 'Feedback' }
];

function brandLogo(idSuffix, size = 38) {
  const gradId = `logoGrad-${idSuffix}`;
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true" class="brand-logo-svg">
    <defs>
      <linearGradient id="${gradId}" x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" class="logo-stop-1"/>
        <stop offset="100%" class="logo-stop-2"/>
      </linearGradient>
    </defs>
    <rect x="1.5" y="1.5" width="37" height="37" rx="12" fill="url(#${gradId})"/>
    <rect x="1.5" y="1.5" width="37" height="37" rx="12" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
    <text x="20" y="27" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-style="italic" font-weight="700" font-size="17" fill="#fff">FH</text>
    <path class="brand-logo-star" d="M31.5 7.5 32.6 10 35 11.1 32.6 12.2 31.5 14.7 30.4 12.2 28 11.1 30.4 10z" fill="#fff"/>
  </svg>`;
}

function navbar({ user, path }) {
  const cats = Categories.all();
  const links = NAV_LINKS.map(
    (l) => `<a href="${l.href}" class="${path && path.startsWith(l.href) ? 'active' : ''}">${l.label}</a>`
  ).join('');

  const authArea = user
    ? `<div class="dropdown">
        <button class="avatar-btn" data-dropdown-trigger type="button" aria-haspopup="true">
          <span class="avatar-sm">${user.avatar ? `<img src="${user.avatar}" alt="">` : avatarArt(user.id, user.name)}</span>
          <span style="font-size:.85rem;font-weight:600;padding-right:4px">${user.name.split(' ')[0]}</span>
          ${icon('chevronDown', { size: 15 })}
        </button>
        <div class="dropdown-menu">
          <a href="/dashboard">${icon('grid', { size: 16 })} Dashboard</a>
          <a href="/profile">${icon('usercircle', { size: 16 })} Profile settings</a>
          ${user.role === 'admin' ? `<a href="/admin">${icon('shield', { size: 16 })} Admin panel</a>` : ''}
          <hr>
          <form action="/logout" method="POST" style="margin:0">
            <button type="submit">${icon('logout', { size: 16 })} Log out</button>
          </form>
        </div>
      </div>`
    : `<a href="/login" class="btn btn-ghost btn-sm">Log in</a>
       <a href="/register" class="btn btn-primary btn-sm">${icon('sparkles', { size: 15 })} Join free</a>`;

  return `
  <div class="topnav-wrap" id="topnavWrap">
    <header class="topnav">
      <div class="container">
        <a href="/" class="brand">
          <span class="brand-mark">${brandLogo('nav')}</span>
          <span class="brand-word">
            <span class="brand-title">Fan Hub <em>Plus</em></span>
            <svg class="brand-signature" width="88" height="10" viewBox="0 0 88 10" aria-hidden="true">
              <path d="M2 6.5c6-6 10-6 14 0s10 6 14 0 10-6 14 0 10 6 14 0 8-4 12-2" />
            </svg>
            <small>Fandom Universe</small>
          </span>
        </a>
        <nav class="nav-links" id="navLinks">${links}</nav>
        <div class="nav-actions">
          <button class="icon-btn" data-toggle-cursorfx type="button" aria-label="Toggle cursor glow trail" title="Toggle cursor glow trail">
            ${icon('sparkles', { size: 16 })}
          </button>
          <button class="icon-btn" data-toggle-theme type="button" aria-label="Toggle dark mode" title="Toggle dark mode">
            ${icon('moon', { size: 17, class: 'theme-icon-dark icon-bounce-hover' })}
          </button>
          ${authArea}
          <button class="icon-btn nav-mobile-toggle" data-nav-toggle type="button" aria-label="Open menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line class="icon-menu-line" x1="4" y1="7" x2="20" y2="7"/>
              <line class="icon-menu-line" x1="4" y1="12.5" x2="20" y2="12.5"/>
              <line class="icon-menu-line" x1="4" y1="18" x2="20" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  </div>`;
}

function footer() {
  const cats = Categories.all();
  const catLinks = cats.map((c) => `<a href="/explore?category=${c.slug}">${c.name}</a>`).join('');
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="brand" style="margin-bottom:10px">
            <span class="brand-mark">${brandLogo('foot', 34)}</span>
            <span class="brand-word"><span class="brand-title">Fan Hub <em>Plus</em></span></span>
          </div>
          <p style="max-width:280px">One calm, organized home for every fandom you're part of &mdash; anime to cosplay and everything between.</p>
        </div>
        <div><h4>Fandoms</h4>${catLinks}</div>
        <div><h4>Platform</h4>
          <a href="/characters">Character hub</a>
          <a href="/articles">Featured articles</a>
          <a href="/merch">Merch showcase</a>
          <a href="/events">Event calendar</a>
        </div>
        <div><h4>Support</h4>
          <a href="/feedback">Send feedback</a>
          <a href="/sitemap">Sitemap</a>
          <a href="/login">Log in</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; ${new Date().getFullYear()} Fan Hub Plus &mdash; a fan project, built by Visionary Coders.</span>
        <span>Made with hand-rolled Node.js, zero UI frameworks.</span>
      </div>
      <div class="footer-credits" aria-hidden="true">
        <div class="footer-credits-track">
          <span><em>Directed by</em>the Fan Hub Plus community</span>
          <span><em>Starring</em>eight fandoms &amp; counting</span>
          <span><em>Cinematography</em>calm, dusty-gold light</span>
          <span><em>Score</em>a quiet equalizer, always running</span>
          <span><em>Produced by</em>Visionary Coders</span>
          <span><em>Directed by</em>the Fan Hub Plus community</span>
          <span><em>Starring</em>eight fandoms &amp; counting</span>
          <span><em>Cinematography</em>calm, dusty-gold light</span>
          <span><em>Score</em>a quiet equalizer, always running</span>
          <span><em>Produced by</em>Visionary Coders</span>
        </div>
      </div>
    </div>
  </footer>`;
}

function chatbotWidget() {
  return `
  <div class="chatbot-teaser" id="chatbotTeaser" role="status">
    <button class="chatbot-teaser-close" id="chatbotTeaserClose" type="button" aria-label="Dismiss">${icon('x', { size: 12 })}</button>
    <span>${icon('sparkles', { size: 14 })} Lost in the multiverse? Ask me anything &mdash; I know every fandom here.</span>
  </div>
  <span class="chatbot-help-label">${icon('sparkles', { size: 12 })} Always here to help</span>
  <button class="chatbot-fab" id="chatbotFab" type="button" aria-label="Open assistant">
    <span class="chatbot-fab-ring"></span>
    ${icon('robot', { size: 24, class: 'chatbot-fab-icon' })}
    <span class="chatbot-wave" id="chatbotWave" aria-hidden="true">👋</span>
  </button>
  <div class="chatbot-panel" id="chatbotPanel">
    <div class="chatbot-head">
      <div style="display:flex;align-items:center;gap:8px;font-weight:700;font-size:.92rem">${icon('robot', { size: 18 })} Fan Hub Assistant</div>
      <button id="chatbotClose" type="button" style="background:none;border:none;color:#fff;cursor:pointer">${icon('x', { size: 18 })}</button>
    </div>
    <div class="chatbot-body" id="chatbotBody"></div>
    <div class="chatbot-suggests" id="chatbotSuggests"></div>
    <form class="chatbot-input" id="chatbotForm">
      <input type="text" id="chatbotInput" placeholder="Ask a question..." autocomplete="off">
      <button type="submit" class="icon-btn" style="background:var(--primary);color:#fff;border-color:var(--primary)">${icon('send', { size: 16 })}</button>
    </form>
  </div>`;
}

function comicIntro() {
  const panels = [
    { glyph: 'film', a: '#F97316', b: '#F43F5E', sfx: 'ZOOM', rot: -7 },
    { glyph: 'book', a: '#7C3AED', b: '#EC4899', sfx: 'POW', rot: 5 },
    { glyph: 'gamepad', a: '#0EA5E9', b: '#34D399', sfx: 'LEVEL UP', rot: -4 },
    { glyph: 'sparkles', a: '#6C5CE7', b: '#22D3EE', sfx: 'WHOOSH', rot: 8 },
    { glyph: 'mic', a: '#DB2777', b: '#F59E0B', sfx: 'ENCORE', rot: -6 },
    { glyph: 'shirt', a: '#14B8A6', b: '#818CF8', sfx: 'ZAP', rot: 4 }
  ];
  const panelHtml = panels
    .map(
      (p, i) => `
    <div class="intro-panel ip${i + 1}" style="--rot:${p.rot}deg">
      <div class="intro-panel-art" style="background:linear-gradient(135deg, ${p.a}, ${p.b})">
        ${icon(p.glyph, { size: 30 })}
        <span class="intro-sfx">${p.sfx}</span>
      </div>
    </div>`
    )
    .join('');

  return `
  <div class="intro-overlay" id="introOverlay" aria-hidden="true">
    <div class="intro-halftone"></div>
    <div class="intro-rays"></div>
    <div class="intro-panels">${panelHtml}</div>
    <div class="intro-card">
      <div class="intro-burst"></div>
      <div class="intro-card-mark">${brandLogo('intro', 54)}</div>
      <div class="intro-card-title">Fan Hub <em>Plus</em></div>
      <div class="intro-card-sub">Every fandom. One universe.</div>
      <div class="intro-charge" aria-hidden="true"><span></span></div>
    </div>
    <button class="intro-skip" id="introSkip" type="button">Skip &rsaquo;</button>
  </div>
  <script>
    (function () {
      var el = document.getElementById('introOverlay');
      if (!el) return;
      var seen = false;
      try { seen = sessionStorage.getItem('fh-intro-seen') === '1'; } catch (e) {}
      var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (seen || reduced) { el.style.display = 'none'; return; }
      try { sessionStorage.setItem('fh-intro-seen', '1'); } catch (e) {}
      function finish() {
        el.classList.add('is-leaving');
        setTimeout(function () { el.style.display = 'none'; }, 480);
      }
      document.getElementById('introSkip').addEventListener('click', finish);
      el.addEventListener('click', finish);
      setTimeout(finish, 3400);
    })();
  </script>`;
}

function flashStack(flash) {
  if (!flash) return '';
  const iconName = flash.type === 'error' ? 'x' : flash.type === 'info' ? 'info' : 'check';
  return `<div class="flash-stack"><div class="flash ${flash.type}">${icon(iconName, { size: 17 })}<span>${flash.text}</span></div></div>`;
}

function breadcrumbs(trail) {
  if (!trail || !trail.length) return '';
  const parts = trail
    .map((t, i) => {
      if (i === trail.length - 1) return `<span class="current">${t.label}</span>`;
      return `<a href="${t.href}">${t.label}</a><span class="sep">${icon('chevronRight', { size: 12 })}</span>`;
    })
    .join('');
  return `<div class="breadcrumbs container">${parts}</div>`;
}

function layout({ title, body, user, path, description, bodyClass = '', flash, trail, extraHead = '' }) {
  const themeAttr = user && user.theme === 'light' ? ' data-theme="light"' : '';

  const pageTitle = title ? `${title} · Fan Hub Plus` : 'Fan Hub Plus — The Fandom Universe Portal';
  const pageDescription = description || 'A calm, curated home for anime, gaming, movies, TV, K-pop, comics, manga and cosplay fandoms.';
  const ctx = requestContext.current();
  const origin = ctx ? `${ctx.protocol}://${ctx.host}` : '';
  const canonicalPath = (ctx && ctx.url) || path || '/';
  const canonicalUrl = `${origin}${canonicalPath}`;
  const ogImageUrl = `${origin}/img/og-image.png`;
  const isNoIndex = !!(path && NOINDEX_PREFIXES.some((p) => path.startsWith(p)));
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Fan Hub Plus',
    alternateName: 'Fan Hub Plus — The Fandom Universe Portal',
    url: origin || '/',
    description: pageDescription,
    publisher: { '@type': 'Organization', name: 'Visionary Coders' }
  };

  return `<!doctype html>
<html lang="en"${themeAttr}${user && user.fontSize && user.fontSize !== 'md' ? ` data-fontsize="${user.fontSize}"` : ''}>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escHtml(pageTitle)}</title>
  <meta name="description" content="${escHtml(pageDescription)}">
  <meta name="robots" content="${isNoIndex ? 'noindex, nofollow' : 'index, follow'}">
  <link rel="canonical" href="${escHtml(canonicalUrl)}">
  <meta name="theme-color" content="#0b0b12">
  <meta name="author" content="Visionary Coders">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Fan Hub Plus">
  <meta property="og:title" content="${escHtml(pageTitle)}">
  <meta property="og:description" content="${escHtml(pageDescription)}">
  <meta property="og:url" content="${escHtml(canonicalUrl)}">
  <meta property="og:image" content="${escHtml(ogImageUrl)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="en_US">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escHtml(pageTitle)}">
  <meta name="twitter:description" content="${escHtml(pageDescription)}">
  <meta name="twitter:image" content="${escHtml(ogImageUrl)}">
  <link rel="icon" href="data:image/svg+xml,${encodeURIComponent('<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22><rect width=%2224%22 height=%2224%22 rx=%226%22 fill=%22%230A1128%22/><circle cx=%2212%22 cy=%2212%22 r=%225.5%22 fill=%22%23C9A961%22/></svg>')}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&family=Manrope:wght@400;500;600;700;800&display=swap">
  <link rel="stylesheet" href="/css/style.css?v=${ASSET_VERSION}">
  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>
  ${extraHead}
  <script>
    (function(){
      var t = localStorage.getItem('fh-theme');
      if (t === 'light') document.documentElement.setAttribute('data-theme','light');
      var fs = localStorage.getItem('fh-fontsize');
      if (fs) document.documentElement.setAttribute('data-fontsize', fs);
    })();
  </script>
</head>
<body class="${bodyClass}" data-logged-in="${user ? '1' : '0'}">
  ${comicIntro()}
  <div class="ambient-stage" aria-hidden="true">
    <div class="ambient-spot s1"></div>
    <div class="ambient-spot s2"></div>
    <div class="ambient-glow"></div>
    ${icon('sparkles', { size: 16, class: 'ambient-note' })}
    ${icon('sparkles', { size: 20, class: 'ambient-note' })}
    ${icon('sparkles', { size: 14, class: 'ambient-note' })}
    ${icon('sparkles', { size: 18, class: 'ambient-note' })}
    ${Array.from({ length: 8 }).map(() => '<span class="ambient-petal"></span>').join('')}
    ${Array.from({ length: 5 }).map(() => '<span class="ambient-orb"></span>').join('')}
    <div class="ambient-dust">${Array.from({ length: 22 }).map(() => '<span></span>').join('')}</div>
    <div class="ambient-vignette"></div>
  </div>
  <div class="cursor-glow" id="cursorGlow" aria-hidden="true"></div>
  ${flashStack(flash)}
  ${navbar({ user, path })}
  ${breadcrumbs(trail)}
  <main>${body}</main>
  ${footer()}
  ${chatbotWidget()}
  <script src="/js/main.js?v=${ASSET_VERSION}"></script>
  <script src="/js/chatbot.js?v=${ASSET_VERSION}"></script>
</body>
</html>`;
}

module.exports = { layout, icon, avatarArt, ASSET_VERSION };
