const { icon } = require('./icons');
const { bannerArt, avatarArt, hash } = require('./art');

function avgRating(ratings) {
  if (!ratings || !ratings.length) return 0;
  return ratings.reduce((s, r) => s + r.stars, 0) / ratings.length;
}
const EVENT_PHOTOS = [
  'photo-1760966362386-e1012dbc3657', 
  'photo-1760539619529-cfd85a2a9cfd',
  'photo-1666289186874-0d023fe7d002',
  'photo-1760092189954-5b2f6eb3ca88',
  'photo-1663668566893-7a4887f9a41d',
  'photo-1758550445758-165aeab5b26e'
];
function eventPhoto(seed) {
  const id = EVENT_PHOTOS[hash(seed) % EVENT_PHOTOS.length];
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=200&h=200&q=60`;
}

const CINEMA_PHOTOS = [
  'premium_photo-1683740128672-7f1a4b824f5e',
  'photo-1440404653325-ab127d49abc1',
  'photo-1643553517154-24eb7fd86437'
];
function cinemaPhoto(seed, size = 500) {
  const id = CINEMA_PHOTOS[hash(seed) % CINEMA_PHOTOS.length];
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${size}&h=${Math.round(size * 1.4)}&q=65`;
}
function concertPhoto(seed, size = 480) {
  const id = EVENT_PHOTOS[hash(seed) % EVENT_PHOTOS.length];
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${size}&h=${Math.round(size * 0.75)}&q=65`;
}

const TYPE_ICON = { article: 'book', video: 'film', audio: 'mic', image: 'sparkles' };

function contentCard(item, category, { bookmarked = false, photo = null } = {}) {
  const rating = avgRating(item.ratings);
  const media = photo && photo.url
    ? `<img src="${photo.url}" alt="${(photo.alt || item.title).replace(/"/g, '&quot;')}" loading="lazy">`
    : bannerArt(item.title, category ? category.slug : '', {});
  return `
  <article class="card" data-reveal>
    <div class="card-media">
      <a href="/content/${item.id}">${media}</a>
      <span class="card-type-badge">${icon(TYPE_ICON[item.type] || 'sparkles', { size: 12 })} ${item.type}</span>
      <button class="icon-btn card-bookmark ${bookmarked ? 'is-active' : ''}" data-bookmark-toggle data-target-type="content" data-target-id="${item.id}" aria-label="Bookmark" aria-pressed="${bookmarked}">${icon('bookmark', { size: 15 })}</button>
    </div>
    <div class="card-body">
      ${category ? `<span class="tag tag-primary">${category.name}</span>` : ''}
      <div class="card-title"><a href="/content/${item.id}">${item.title}</a></div>
      <p class="card-desc">${item.description || ''}</p>
      <div class="card-meta">
        <span>${new Date(item.releaseDate || item.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
        <span class="stars">${icon('star', { size: 13 })} ${rating ? rating.toFixed(1) : 'New'}</span>
      </div>
    </div>
  </article>`;
}

function characterCard(ch, category, { bookmarked = false, photo = null } = {}) {
  const media = photo && photo.url
    ? `<img src="${photo.url}" alt="${(photo.alt || ch.name).replace(/"/g, '&quot;')}" loading="lazy">`
    : bannerArt(ch.name, category ? category.slug : '', {});
  return `
  <article class="card card-glow" data-reveal>
    <div class="card-media">
      <a href="/characters/${ch.id}">${media}</a>
      <button class="icon-btn card-bookmark ${bookmarked ? 'is-active' : ''}" data-bookmark-toggle data-target-type="character" data-target-id="${ch.id}" aria-label="Bookmark" aria-pressed="${bookmarked}">${icon('bookmark', { size: 15 })}</button>
      ${ch.affiliation ? `<div class="card-stat-slide">${icon('shield', { size: 12 })} ${ch.affiliation}</div>` : ''}
    </div>
    <div class="card-body">
      ${category ? `<span class="tag tag-primary">${category.name}</span>` : ''}
      <div class="card-title"><a href="/characters/${ch.id}">${ch.name}</a></div>
      <p class="card-desc">${ch.bio}</p>
      <div class="card-meta"><span>${ch.affiliation || ''}</span></div>
    </div>
  </article>`;
}

function merchCard(item, category, { bookmarked = false, photo = null } = {}) {
  const media = photo && photo.url
    ? `<img src="${photo.url}" alt="${(photo.alt || item.name).replace(/"/g, '&quot;')}" loading="lazy">`
    : bannerArt(item.name, category ? category.slug : '', {});
  return `
  <article class="card" data-reveal>
    <div class="card-media">
      <a href="/merch/${item.id}">${media}</a>
      <span class="card-type-badge">${item.isUpcoming ? icon('clock', { size: 12 }) : icon('fire', { size: 12 })} ${item.isUpcoming ? 'Upcoming' : item.tag}</span>
      <button class="icon-btn card-bookmark ${bookmarked ? 'is-active' : ''}" data-bookmark-toggle data-target-type="merch" data-target-id="${item.id}" aria-label="Bookmark" aria-pressed="${bookmarked}">${icon('bookmark', { size: 15 })}</button>
    </div>
    <div class="card-body">
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${category ? `<span class="tag tag-primary">${category.name}</span>` : ''}
        <span class="tag tag-warm">${item.tag}</span>
      </div>
      <div class="card-title"><a href="/merch/${item.id}">${item.name}</a></div>
      <p class="card-desc">${item.description}</p>
      <div class="card-meta">
        <span>${item.isUpcoming ? 'Releases ' + new Date(item.releaseDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : new Date(item.releaseDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
        <span>${icon('eye', { size: 13 })} ${item.viewCount}</span>
      </div>
    </div>
  </article>`;
}

function eventRow(ev) {
  return `
  <div class="event-row-wrap" data-reveal>
    <div class="event-row" data-city="${ev.city}" style="display:flex;gap:16px;align-items:center;padding:16px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);margin-bottom:0" data-reveal>
      <img class="event-row-photo" src="${eventPhoto(ev.title)}" alt="" loading="lazy" width="54" height="54">
      <div style="flex:1;min-width:0">
        <div style="font-weight:700">${ev.title}</div>
        <div style="font-size:.82rem;color:var(--text-faint);display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span>${icon('mappin', { size: 13 })} ${ev.venue}, ${ev.city} &middot; ${new Date(ev.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          ${ev.lat != null && ev.lng != null ? `<span class="weather-badge" data-weather data-lat="${ev.lat}" data-lng="${ev.lng}"><span class="live-dot"></span>&hellip;</span>` : ''}
        </div>
      </div>
      <span class="tag tag-primary">${ev.type}</span>
      <button type="button" class="btn btn-outline btn-sm" data-event-info-toggle aria-expanded="false">${icon('ticket', { size: 14 })} Info</button>
    </div>
    <div class="event-row-details" hidden>${ev.description || 'No further details for this event yet.'}</div>
  </div>`;
}

function emptyState(message, iconName = 'search') {
  return `<div class="empty-state">${icon(iconName, { size: 40 })}<p style="margin-top:10px">${message}</p></div>`;
}

function starWidget(item, { userStars = 0 } = {}) {
  const stars = [1, 2, 3, 4, 5]
    .map((n) => `<button type="button" data-value="${n}" class="${n <= userStars ? 'active' : ''}">${icon('star', { size: 20 })}</button>`)
    .join('');
  const avg = avgRating(item.ratings);
  return `<div class="star-rate" data-content-id="${item.id}">${stars}</div>
  <span style="font-size:.8rem;color:var(--text-faint)" data-avg-rating="${item.id}">${avg.toFixed(1)} (${item.ratings.length})</span>`;
}

module.exports = { contentCard, characterCard, merchCard, eventRow, emptyState, starWidget, avgRating, cinemaPhoto, concertPhoto };
