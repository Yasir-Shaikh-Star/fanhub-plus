const { icon } = require('./icons');
const LANES = [
  ['#6C5CE7', '#22D3EE'],
  ['#7C3AED', '#EC4899'],
  ['#0EA5E9', '#34D399'],
  ['#F97316', '#F43F5E'],
  ['#6366F1', '#06B6D4'],
  ['#DB2777', '#F59E0B'],
  ['#14B8A6', '#818CF8'],
  ['#EF4444', '#8B5CF6']
];

const CATEGORY_GLYPH = {
  anime: 'sparkles',
  gaming: 'gamepad',
  movies: 'film',
  'tv-shows': 'film',
  kpop: 'mic',
  comics: 'book',
  manga: 'book',
  cosplay: 'shirt'
};

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function laneFor(seed) {
  return LANES[hash(seed) % LANES.length];
}

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}


function bannerArt(seed, categorySlug, { tall = false } = {}) {
  const [a, b] = laneFor(seed);
  const glyph = CATEGORY_GLYPH[categorySlug] || 'sparkles';
  const angle = 120 + (hash(seed) % 90);
  const h = tall ? 'height:100%' : '';
  return `<div class="art-banner" style="background:linear-gradient(${angle}deg, ${a}, ${b});${h}">
    <span class="art-glyph">${icon(glyph, { size: 34 })}</span>
    <span class="art-noise"></span>
  </div>`;
}
function avatarArt(seed, label) {
  const [a, b] = laneFor(seed);
  return `<div class="art-avatar" style="background:linear-gradient(150deg, ${a}, ${b})">
    <span>${initials(label || seed)}</span>
  </div>`;
}

module.exports = { bannerArt, avatarArt, laneFor, hash };
