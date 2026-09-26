const { layout, icon } = require('../../core/layout');
const { contentCard, emptyState, cinemaPhoto } = require('../../core/components');
const { photoFor } = require('../../core/categoryPhotos');

const LIVE_SECTION_COPY = {
  movies: { icon: 'film', eyebrow: 'Now Showing', heading: 'This week\'s picks', blurb: (n) => `${n} titles, refreshed regularly with real posters, ratings and plots.` },
  anime: { icon: 'sparkles', eyebrow: 'Now Airing', heading: 'Trending this season', blurb: (n) => `${n} series the community is currently talking about.` },
  gaming: { icon: 'gamepad', eyebrow: 'Trending Now', heading: 'What everyone\'s playing', blurb: (n) => `${n} games climbing the charts right now.` }
};

module.exports = function explore({ user, path, flash, items, categories, query, categoryPhotos = {}, liveSection = [], bookmarkedIds = [] }) {
  const catOptions = categories
    .map((c) => `<option value="${c.slug}" ${query.category === c.slug ? 'selected' : ''}>${c.name}</option>`)
    .join('');

  const typeOptions = ['article', 'video', 'audio', 'image']
    .map((t) => `<option value="${t}" ${query.type === t ? 'selected' : ''}>${t[0].toUpperCase() + t.slice(1)}</option>`)
    .join('');

  const grid = items.length
    ? items.map((it) => contentCard(it.content, it.category, {
        bookmarked: bookmarkedIds.includes(it.content.id),
        photo: photoFor(it.content.id, it.category ? it.category.slug : '', categoryPhotos)
      })).join('')
    : emptyState('No content matches those filters yet. Try widening your search.');

  const liveCopy = LIVE_SECTION_COPY[query.category];
  const liveSectionGrid = (liveCopy && liveSection.length)
    ? `
  <section class="section" style="padding-top:0">
    <div class="container">
      <div class="section-head">
        <div>
          <span class="marquee-eyebrow" data-reveal>${icon(liveCopy.icon, { size: 15 })} ${liveCopy.eyebrow}</span>
          <h2 data-reveal style="margin-top:6px">${liveCopy.heading}</h2>
          <p>${liveCopy.blurb(liveSection.length)}</p>
        </div>
      </div>
      <div class="grid grid-4">
        ${liveSection.map((m) => `
        <article class="movie-card" data-reveal tabindex="0">
          ${m.image ? `<img src="${m.image}" alt="${m.title}" loading="lazy">` : `<img src="${cinemaPhoto(m.title, 400)}" alt="" loading="lazy">`}
          ${m.badge ? `<span class="movie-card-badge">${icon('star', { size: 11 })} ${m.badge}</span>` : ''}
          <div class="movie-card-body">
            <div class="movie-card-title">${m.title}</div>
            ${m.meta ? `<div class="movie-card-meta"><span>${icon(liveCopy.icon, { size: 12 })} ${m.meta}</span></div>` : ''}
            <p class="movie-card-synopsis">${m.synopsis || ''}</p>
          </div>
        </article>`).join('')}
      </div>
    </div>
  </section>`
    : '';

  const cinemaMode = query.category === 'movies' || query.category === 'tv-shows';
  const cinemaAmbient = cinemaMode
    ? `
  <div class="cinema-stage" aria-hidden="true">
    <svg class="cinema-reel r1" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="45" fill="none" stroke="var(--primary)" stroke-width="4"/>
      <circle cx="50" cy="50" r="9" fill="var(--primary)"/>
      <circle cx="50" cy="17" r="8" fill="var(--primary)"/>
      <circle cx="78" cy="34" r="8" fill="var(--primary)"/>
      <circle cx="78" cy="66" r="8" fill="var(--primary)"/>
      <circle cx="50" cy="83" r="8" fill="var(--primary)"/>
      <circle cx="22" cy="66" r="8" fill="var(--primary)"/>
      <circle cx="22" cy="34" r="8" fill="var(--primary)"/>
    </svg>
    <svg class="cinema-reel r2" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="45" fill="none" stroke="var(--accent)" stroke-width="4"/>
      <circle cx="50" cy="50" r="9" fill="var(--accent)"/>
      <circle cx="50" cy="17" r="8" fill="var(--accent)"/>
      <circle cx="78" cy="34" r="8" fill="var(--accent)"/>
      <circle cx="78" cy="66" r="8" fill="var(--accent)"/>
      <circle cx="50" cy="83" r="8" fill="var(--accent)"/>
      <circle cx="22" cy="66" r="8" fill="var(--accent)"/>
      <circle cx="22" cy="34" r="8" fill="var(--accent)"/>
    </svg>
    ${icon('film', { size: 26, class: 'cinema-clapper c1' })}
    ${icon('film', { size: 20, class: 'cinema-clapper c2' })}
    <div class="cinema-marquee">${Array.from({ length: 26 }).map(() => '<span></span>').join('')}</div>
    <div class="cinema-grain"></div>
  </div>`
    : '';

  const body = `
  ${cinemaAmbient}
  <section class="section">
    <div class="container">
      <div class="section-head">
        <div><h1 style="font-size:1.7rem">${icon(cinemaMode ? 'film' : 'compass', { size: 22 })} Fandom Content Explorer</h1><p>Search, filter and sort curated content across every fandom.</p></div>
      </div>

      <form method="GET" action="/explore" class="toolbar form-card" style="padding:16px 18px">
        <div class="input-icon-wrap search-box">
          ${icon('search', { size: 16 })}
          <input type="search" name="q" placeholder="Search titles and descriptions..." value="${query.q || ''}">
        </div>
        <select name="category" data-autosubmit><option value="">All fandoms</option>${catOptions}</select>
        <select name="type" data-autosubmit><option value="">All content types</option>${typeOptions}</select>
        <select name="sort" data-autosubmit>
          <option value="latest" ${(!query.sort || query.sort === 'latest') ? 'selected' : ''}>Latest</option>
          <option value="popular" ${query.sort === 'popular' ? 'selected' : ''}>Most popular</option>
          <option value="az" ${query.sort === 'az' ? 'selected' : ''}>Alphabetical</option>
        </select>
        <button type="submit" class="btn btn-primary btn-sm">${icon('filter', { size: 14 })} Apply</button>
        ${(query.q || query.category || query.type || (query.sort && query.sort !== 'latest')) ? `<a href="/explore" class="btn btn-ghost btn-sm">${icon('x', { size: 14 })} Clear</a>` : ''}
      </form>
    </div>
  </section>
  ${liveSectionGrid}
  <section class="section" style="${liveSectionGrid ? 'padding-top:0' : ''}">
    <div class="container">
      ${liveSectionGrid ? `<div class="section-head"><div><h2>Community write-ups</h2><p>Original fan-made picks alongside the picks above.</p></div></div>` : ''}
      <p style="font-size:.84rem;color:var(--text-faint);margin:16px 0">${liveSectionGrid ? `${items.length} community write-up${items.length === 1 ? '' : 's'}` : `${items.length} result${items.length === 1 ? '' : 's'}`}</p>
      <div class="grid grid-4">${grid}</div>
    </div>
  </section>`;

  return layout({
    title: 'Explore',
    body,
    user,
    path,
    flash,
    bodyClass: cinemaMode ? 'theme-cinema' : '',
    trail: [{ href: '/', label: 'Home' }, { href: '/explore', label: 'Explore' }]
  });
};
