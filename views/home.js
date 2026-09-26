const { layout, icon } = require('../core/layout');
const { contentCard, characterCard, eventRow, cinemaPhoto, concertPhoto } = require('../core/components');

const CATEGORY_ICON = { anime: 'sparkles', gaming: 'gamepad', movies: 'film', 'tv-shows': 'film', kpop: 'mic', comics: 'book', manga: 'book', cosplay: 'shirt' };
const { laneFor, hash } = require('../core/art');
const { photoFor } = require('../core/categoryPhotos');

const SKYLINE_BUILDINGS = [
  { x: 0, w: 46, h: 120 }, { x: 50, w: 30, h: 180 }, { x: 84, w: 54, h: 90 },
  { x: 142, w: 38, h: 210 }, { x: 184, w: 60, h: 140 }, { x: 248, w: 34, h: 170 },
  { x: 286, w: 48, h: 100 }, { x: 338, w: 42, h: 230 }, { x: 384, w: 58, h: 130 },
  { x: 446, w: 32, h: 190 }, { x: 482, w: 50, h: 110 }, { x: 536, w: 40, h: 200 },
  { x: 580, w: 62, h: 150 }, { x: 646, w: 36, h: 175 }, { x: 686, w: 46, h: 95 },
  { x: 736, w: 54, h: 215 }, { x: 794, w: 38, h: 135 }, { x: 836, w: 44, h: 185 },
  { x: 884, w: 60, h: 105 }, { x: 948, w: 32, h: 220 }, { x: 984, w: 48, h: 145 },
  { x: 1036, w: 40, h: 165 }, { x: 1080, w: 56, h: 120 }, { x: 1140, w: 60, h: 195 }
];
const SKY_W = 1200, SKY_H = 260;
function heroSkyline() {
  const buildingsSvg = SKYLINE_BUILDINGS.map((b, i) => {
    const cols = Math.max(2, Math.floor(b.w / 12));
    const rows = Math.max(2, Math.floor(b.h / 18));
    const windows = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (hash(`w-${i}-${r}-${c}`) % 5 === 0) continue;
        const wx = b.x + 4 + (c * (b.w - 8)) / cols;
        const wy = SKY_H - b.h + 6 + (r * (b.h - 12)) / rows;
        const lit = hash(`lit-${i}-${r}-${c}`) % 3 === 0;
        const delay = (hash(`d-${i}-${r}-${c}`) % 50) / 10;
        windows.push(`<rect class="sky-window${lit ? ' is-lit' : ''}" x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="3" height="4" rx="0.5" style="animation-delay:${delay}s"/>`);
      }
    }
    return `<g><rect class="sky-building" x="${b.x}" y="${SKY_H - b.h}" width="${b.w}" height="${b.h}" rx="1.5"/>${windows.join('')}</g>`;
  }).join('');
  const tile = `<svg viewBox="0 0 ${SKY_W} ${SKY_H}" preserveAspectRatio="none" aria-hidden="true">${buildingsSvg}</svg>`;
  return `
  <div class="hero-skyline-wrap" aria-hidden="true">
    <div class="hero-skyline-track">${tile}${tile}</div>
    <div class="hero-skyline-fade"></div>
  </div>`;
}

const NOW_PLAYING = [
  { title: 'Ashfall Horizon', tag: 'Anime Film', rating: '4.8', synopsis: 'A retired mech pilot is pulled back for one last flight when the sky itself starts to fracture.' },
  { title: 'The Last Cartridge', tag: 'Gaming Saga', rating: '4.6', synopsis: 'Three rival speedrunners discover the game they’ve mastered has started rewriting its own rules.' },
  { title: 'Neon Kingdom', tag: 'K-Pop Drama', rating: '4.9', synopsis: 'A trainee idol group’s final showcase becomes a fight to keep their own story from being erased.' },
  { title: 'Ink & Iron', tag: 'Comic Adaptation', rating: '4.5', synopsis: 'A retired vigilante’s sketchbook starts predicting crimes before they happen — including his own.' },
  { title: 'Paper Moon Society', tag: 'Manga Feature', rating: '4.7', synopsis: 'Four strangers bound by a decades-old manga club letter reunite to finish what its author never could.' },
  { title: 'Static & Sequins', tag: 'Cosplay Doc', rating: '4.4', synopsis: 'Follow six cosplayers across one convention season as they build the costumes of their lives.' }
];

function heroCharacter() {
  return `
  <div class="hero-character" aria-hidden="true">
    <div class="hero-character-aura"></div>
    <svg viewBox="0 0 220 420" class="hero-character-svg">
      <defs>
        <linearGradient id="heroCharGrad" x1="0" y1="0" x2="220" y2="420" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="var(--accent-warm)"/>
          <stop offset="50%" stop-color="var(--accent)"/>
          <stop offset="100%" stop-color="var(--primary)"/>
        </linearGradient>
        <linearGradient id="heroCharRim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fff" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <!-- flowing cape -->
      <path class="hero-char-cape" d="M110 130 C40 160 15 260 35 380 C70 340 95 320 110 320 C125 320 150 340 185 380 C205 260 180 160 110 130Z" fill="url(#heroCharGrad)" opacity="0.5"/>
      <!-- legs -->
      <path d="M92 300 L84 400 L104 400 L112 305Z" fill="url(#heroCharGrad)"/>
      <path d="M128 300 L136 400 L116 400 L108 305Z" fill="url(#heroCharGrad)"/>
      <!-- torso -->
      <path d="M78 175 C78 145 95 128 110 128 C125 128 142 145 142 175 L138 300 L82 300Z" fill="url(#heroCharGrad)"/>
      <!-- head -->
      <circle cx="110" cy="95" r="34" fill="url(#heroCharGrad)"/>
      <!-- halo ring -->
      <circle cx="110" cy="95" r="50" fill="none" stroke="var(--primary)" stroke-width="2" opacity="0.6" class="hero-char-halo"/>
      <!-- rim light -->
      <path d="M78 175 C78 145 95 128 110 128" fill="none" stroke="url(#heroCharRim)" stroke-width="3" stroke-linecap="round"/>
      <!-- energy blade -->
      <path class="hero-char-blade" d="M142 190 L206 110 L198 104 L138 178Z" fill="var(--primary)" opacity="0.85"/>
      <circle cx="150" cy="185" r="5" fill="#fff" opacity="0.9"/>
    </svg>
    <span class="hero-character-spark s1"></span>
    <span class="hero-character-spark s2"></span>
    <span class="hero-character-spark s3"></span>
  </div>`;
}

const ON_TOUR = [
  { title: 'Encore Nights', city: 'Live in 6 cities' },
  { title: 'Afterglow Sessions', city: 'Acoustic pop-ups' },
  { title: 'The Static Parade', city: 'Arena tour' },
  { title: 'Velvet Reverb', city: 'Late-night sets' }
];

module.exports = function home({ user, path, flash, categories, trending, characters, upcomingEvents, liveMovies, livePhotos, categoryPhotos = {}, bookmarkedIds = [] }) {
  const catGrid = categories
    .map((c) => {
      const [a, b] = laneFor(c.slug);
      const photo = photoFor(c.slug, c.slug, categoryPhotos);
      const photoImg = photo && photo.url ? `<img class="cc-photo" src="${photo.url}" alt="" loading="lazy">` : '';
      return `<a href="/explore?category=${c.slug}" class="category-chip${photoImg ? ' has-photo' : ''}" data-reveal>
        ${photoImg}
        <span class="cc-icon" style="background:linear-gradient(135deg, ${a}, ${b})">${icon(CATEGORY_ICON[c.slug] || 'sparkles', { size: 20 })}</span>
        <span class="cc-name">${c.name}</span>
        <span class="cc-desc">${c.description}</span>
      </a>`;
    })
    .join('');

  const trendingGrid = trending.map((item) => contentCard(item.content, item.category, {
    bookmarked: bookmarkedIds.includes(item.content.id),
    photo: photoFor(item.content.id, item.category ? item.category.slug : '', categoryPhotos)
  })).join('');
  const charGrid = characters.map((ch) => characterCard(ch.character, ch.category, {
    bookmarked: bookmarkedIds.includes(ch.character.id),
    photo: photoFor(ch.character.id, ch.category ? ch.category.slug : '', categoryPhotos)
  })).join('');
  const eventsList = upcomingEvents.map(eventRow).join('');

  const usingLiveMovies = Array.isArray(liveMovies) && liveMovies.length > 0;
  const movieRail = usingLiveMovies
    ? liveMovies.map((m) => `
    <article class="movie-card" data-reveal tabindex="0">
      ${m.poster ? `<img src="${m.poster}" alt="${m.title} poster" loading="lazy">` : `<img src="${cinemaPhoto(m.title, 400)}" alt="" loading="lazy">`}
      <span class="movie-card-badge">${icon('star', { size: 11 })} ${m.rating || '—'}</span>
      <div class="movie-card-body">
        <div class="movie-card-title">${m.title}</div>
        <div class="movie-card-meta"><span>${icon('film', { size: 12 })} ${m.genre || m.year}</span></div>
        <p class="movie-card-synopsis">${m.plot || ''}</p>
      </div>
    </article>`).join('')
    : NOW_PLAYING.map((m, i) => `
    <article class="movie-card" data-reveal tabindex="0">
      <img src="${cinemaPhoto(m.title + i, 400)}" alt="" loading="lazy">
      <span class="movie-card-badge">${icon('star', { size: 11 })} ${m.rating}</span>
      <div class="movie-card-body">
        <div class="movie-card-title">${m.title}</div>
        <div class="movie-card-meta"><span>${icon('film', { size: 12 })} ${m.tag}</span></div>
        <p class="movie-card-synopsis">${m.synopsis}</p>
      </div>
    </article>`).join('');

  const usingLivePhotos = Array.isArray(livePhotos) && livePhotos.length > 0;
  const concertRail = usingLivePhotos
    ? livePhotos.map((p, i) => {
        const c = ON_TOUR[i % ON_TOUR.length];
        return `
    <article class="concert-card" data-reveal>
      <img src="${p.url}" alt="${p.alt}" loading="lazy">
      <span class="concert-card-label">${icon('mic', { size: 13 })} ${c.title} &middot; ${c.city}</span>
    </article>`;
      }).join('')
    : ON_TOUR.map((c, i) => `
    <article class="concert-card" data-reveal>
      <img src="${concertPhoto(c.title + i, 380)}" alt="" loading="lazy">
      <span class="concert-card-label">${icon('mic', { size: 13 })} ${c.title} &middot; ${c.city}</span>
    </article>`).join('');

  const body = `
  <section class="hero">
    ${heroSkyline()}
    <div class="hero-blob b1"></div>
    <div class="hero-blob b2"></div>
    <span class="hero-sparkle" style="top:14%; left:8%">${icon('star', { size: 18 })}</span>
    <span class="hero-sparkle" style="top:62%; left:4%">${icon('sparkles', { size: 22 })}</span>
    <span class="hero-sparkle" style="top:22%; right:10%">${icon('star', { size: 14 })}</span>
    ${heroCharacter()}
    <div class="container">
      <span class="eyebrow reveal">${icon('sparkles', { size: 14, class: 'icon-pulse' })} Eight fandoms, one calm home</span>
      <h1 class="reveal reveal-d1">Everything your <span class="grad-text">fandom</span> loves, organized without the noise.</h1>
      <p class="lead reveal reveal-d2">Anime, gaming, movies, TV, K-pop, comics, manga, and cosplay &mdash; curated articles, media, character profiles, merch drops and real-world events, all in one calm, fast browsing experience.</p>
      <div class="hero-cta reveal reveal-d3">
        <a href="/explore" class="btn btn-primary">${icon('compass', { size: 17 })} Start exploring</a>
        ${user ? `<a href="/dashboard" class="btn btn-outline">${icon('grid', { size: 17 })} Go to dashboard</a>` : `<a href="/register" class="btn btn-outline">${icon('usercircle', { size: 17 })} Create free account</a>`}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head">
        <div><h2>Browse by fandom</h2><p>Pick a universe to dive into.</p></div>
      </div>
      <div class="category-grid">${catGrid}</div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="container">
      <div class="section-head">
        <div><h2>${icon('fire', { size: 20, class: 'icon-pulse' })} Trending right now</h2><p>The most popular articles, videos and clips across every fandom.</p></div>
        <a href="/explore?sort=popular" class="btn btn-ghost btn-sm">See all ${icon('arrowRight', { size: 14 })}</a>
      </div>
      <div class="grid grid-4">${trendingGrid}</div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head">
        <div>
          <span class="marquee-eyebrow" data-reveal>${icon('film', { size: 15 })} Now Playing</span>
          <h2 data-reveal style="margin-top:6px">Fan watchlist, straight from the community</h2>
          <p>Original fan-made picks, not real studio titles &mdash; hover a poster for the synopsis.</p>
        </div>
        <a href="/explore?category=movies" class="btn btn-ghost btn-sm">Browse movies ${icon('arrowRight', { size: 14 })}</a>
      </div>
      <div class="movie-rail">${movieRail}</div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="container">
      <div class="section-head">
        <div>
          <span class="marquee-eyebrow" data-reveal>${icon('mic', { size: 15 })} On Tour</span>
          <h2 data-reveal style="margin-top:6px">Rockstar concert gallery</h2>
          <p>A look at the stages, crowds and lights our community shows up for.</p>
        </div>
        <a href="/events" class="btn btn-ghost btn-sm">See tour dates ${icon('arrowRight', { size: 14 })}</a>
      </div>
      <div class="concert-rail">${concertRail}</div>

      <div class="audio-player" id="homeAudioPlayer" data-playing="false" style="margin-top:26px" role="group" aria-label="Now playing preview">
        <audio id="homeAudioTrack" preload="none" src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"></audio>
        <div class="audio-player-art">${icon('mic', { size: 24 })}</div>
        <div class="audio-player-info">
          <div class="audio-player-title">Afterglow Sessions &mdash; Live Set Preview</div>
          <div class="audio-player-artist">Fan Hub Radio &middot; demo player</div>
        </div>
        <div class="audio-player-controls">
          <button class="icon-btn" type="button" aria-label="Previous track">${icon('skipBack', { size: 15 })}</button>
          <button class="icon-btn is-active" id="audioPlayToggle" type="button" aria-label="Play">${icon('play', { size: 15 })}</button>
          <button class="icon-btn" type="button" aria-label="Next track">${icon('skipNext', { size: 15 })}</button>
        </div>
        <div class="audio-wave" id="audioWave" aria-hidden="true">${Array.from({ length: 28 }).map(() => '<span></span>').join('')}</div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head">
        <div><h2>Featured characters</h2><p>Faces (and mechs, and idols) from across the universe.</p></div>
        <a href="/characters" class="btn btn-ghost btn-sm">See all ${icon('arrowRight', { size: 14 })}</a>
      </div>
      <div class="grid grid-4">${charGrid}</div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="container">
      <div class="section-head">
        <div><h2>${icon('mappin', { size: 20 })} Upcoming events near the fandom</h2><p>Conventions, meetups, screenings, and tour stops.</p></div>
        <a href="/events" class="btn btn-ghost btn-sm">Open event map ${icon('arrowRight', { size: 14 })}</a>
      </div>
      ${eventsList}
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="form-card" style="display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;background:linear-gradient(120deg, var(--primary-tint), transparent)">
        <div>
          <h2 style="margin-bottom:6px">Need a hand finding something?</h2>
          <p style="margin:0">The assistant in the bottom-right corner can point you to bookmarks, events, and settings in a couple of messages.</p>
        </div>
        <button class="btn btn-primary" onclick="document.getElementById('chatbotFab').click()">${icon('robot', { size: 17 })} Ask the assistant</button>
      </div>
    </div>
  </section>
  `;

  return layout({ title: 'Home', body, user, path, flash, bodyClass: 'page-home' });
};
