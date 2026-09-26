const { searchCategoryPhotos, topAnime, topGames } = require('./mediaApi');
const { hash } = require('./art');
const { cinemaPhoto } = require('./components');

const PHOTO_QUERIES = {
  'tv-shows': 'tv show screen binge watching living room',
  comics: 'comic book store shelf collection',
  manga: 'manga book shelf japan bookstore',
  cosplay: 'cosplay convention costume performer',
  kpop: 'kpop concert stage lights crowd'
};
const LIVE_LIST_SOURCES = {
  anime: () => topAnime(12),
  gaming: () => topGames(12)
};

function toPhotoShape(entry) {
  return { url: entry.image, alt: entry.title, credit: null };
}
async function photosForCategories(slugs, count = 8) {
  const unique = [...new Set(slugs)].filter((s) => PHOTO_QUERIES[s] || LIVE_LIST_SOURCES[s]);
  if (!unique.length) return {};
  const results = await Promise.allSettled(
    unique.map((slug) => (LIVE_LIST_SOURCES[slug] ? LIVE_LIST_SOURCES[slug]() : searchCategoryPhotos(PHOTO_QUERIES[slug], count)))
  );
  const map = {};
  unique.forEach((slug, i) => {
    if (results[i].status !== 'fulfilled' || !Array.isArray(results[i].value)) {
      map[slug] = [];
      return;
    }
    map[slug] = LIVE_LIST_SOURCES[slug] ? results[i].value.map(toPhotoShape) : results[i].value;
  });
  return map;
}
function photoFor(itemId, categorySlug, photoMap) {
  if (categorySlug === 'movies') {
    return { url: cinemaPhoto(itemId, 320) };
  }
  const photos = photoMap && photoMap[categorySlug];
  if (!photos || !photos.length) return null;
  return photos[hash(itemId) % photos.length];
}

module.exports = { PHOTO_QUERIES, photosForCategories, photoFor };
