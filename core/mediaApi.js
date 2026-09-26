
const https = require('https');

const cache = new Map();
const DEFAULT_TTL_MS = 30 * 60 * 1000;

function getCached(key) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expires) {
    cache.delete(key);
    return null;
  }
  return hit.data;
}

function setCached(key, data, ttl = DEFAULT_TTL_MS) {
  cache.set(key, { data, expires: Date.now() + ttl });
}

function getJson(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: Object.assign({ 'User-Agent': 'FanHubPlus/1.0' }, headers) }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`Upstream ${res.statusCode}: ${body.slice(0, 200)}`));
          return;
        }
        try {
          resolve(JSON.parse(body));
        } catch (err) {
          reject(new Error('Upstream returned non-JSON response'));
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(8000, () => req.destroy(new Error('Upstream request timed out')));
  });
}

async function searchUnsplashPhotos(query, count = 6) {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) throw new Error('UNSPLASH_ACCESS_KEY is not configured');
  const cacheKey = `unsplash:${query}:${count}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}`;
  const data = await getJson(url, { Authorization: `Client-ID ${key}` });
  const results = (data.results || [])
    .map((p) => ({
      url: p.urls && (p.urls.small || p.urls.regular),
      alt: p.alt_description || query,
      credit: p.user ? p.user.name : null
    }))
    .filter((p) => p.url);
  setCached(cacheKey, results);
  return results;
}

async function searchPexelsPhotos(query, count = 6) {
  const key = process.env.PEXELS_API_KEY;
  if (!key) throw new Error('PEXELS_API_KEY is not configured');
  const cacheKey = `pexels-photo:${query}:${count}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}`;
  const data = await getJson(url, { Authorization: key });
  const results = (data.photos || [])
    .map((p) => ({
      url: p.src && (p.src.medium || p.src.large),
      alt: p.alt || query,
      credit: p.photographer || null
    }))
    .filter((p) => p.url);
  setCached(cacheKey, results);
  return results;
}

async function searchPexelsVideos(query, count = 3) {
  const key = process.env.PEXELS_API_KEY;
  if (!key) throw new Error('PEXELS_API_KEY is not configured');
  const cacheKey = `pexels-video:${query}:${count}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`;
  const data = await getJson(url, { Authorization: key });
  const results = (data.videos || []).map((v) => {
    const files = (v.video_files || []).filter((f) => f.file_type === 'video/mp4');
    const file = files.find((f) => f.width && f.width <= 1280) || files[0];
    return {
      url: file ? file.link : null,
      poster: v.image,
      credit: v.user ? v.user.name : null,
      width: file ? file.width : null,
      height: file ? file.height : null
    };
  }).filter((v) => v.url);
  setCached(cacheKey, results);
  return results;
}

async function searchCategoryPhotos(query, count = 8) {
  // Try both providers and merge, instead of only falling back to Pexels
  // when Unsplash comes back completely empty. A niche query (e.g. a comics
  // or manga search) can easily return just 1-2 Unsplash results even when
  // Unsplash is working fine - merging in Pexels results gives a bigger
  // pool instead of leaving a category stuck with almost no usable photos.
  let unsplash = [];
  try {
    unsplash = await searchUnsplashPhotos(query, count);
  } catch {
  }
  if (unsplash.length >= count) return unsplash;

  let pexels = [];
  try {
    pexels = await searchPexelsPhotos(query, count);
  } catch {
  }
  return [...unsplash, ...pexels];
}

async function getOmdbMovie(titleOrId) {
  const key = process.env.OMDB_API_KEY;
  if (!key) throw new Error('OMDB_API_KEY is not configured');
  const cacheKey = `omdb:${titleOrId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const isImdbId = /^tt\d+$/i.test(titleOrId);
  const param = isImdbId ? `i=${encodeURIComponent(titleOrId)}` : `t=${encodeURIComponent(titleOrId)}`;
  const url = `https://www.omdbapi.com/?${param}&apikey=${key}`;
  const data = await getJson(url);
  if (data.Response === 'False') return null;
  const result = {
    title: data.Title,
    year: data.Year,
    genre: data.Genre,
    rating: data.imdbRating,
    plot: data.Plot,
    poster: data.Poster && data.Poster !== 'N/A' ? data.Poster : null,
    imdbId: data.imdbID
  };
  setCached(cacheKey, result, 6 * 60 * 60 * 1000);
  return result;
}

async function topAnime(count = 10) {
  const cacheKey = `jikan-top:${count}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const url = `https://api.jikan.moe/v4/top/anime?filter=airing&limit=${count}`;
  const data = await getJson(url);
  const results = (data.data || []).map((a) => ({
    title: a.title_english || a.title,
    image: a.images && a.images.jpg && (a.images.jpg.large_image_url || a.images.jpg.image_url),
    synopsis: a.synopsis ? a.synopsis.split('\n')[0].slice(0, 220) : '',
    rating: a.score,
    genre: (a.genres || []).slice(0, 2).map((g) => g.name).join(', ') || a.type,
    episodes: a.episodes
  })).filter((a) => a.image);
  setCached(cacheKey, results, 6 * 60 * 60 * 1000);
  return results;
}

async function topGames(count = 10) {
  const cacheKey = `f2g-top:${count}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const url = `https://www.freetogame.com/api/games?platform=pc&sort-by=popularity`;
  const data = await getJson(url);
  const results = (Array.isArray(data) ? data : []).slice(0, count).map((g) => ({
    title: g.title,
    image: g.thumbnail,
    synopsis: g.short_description || '',
    genre: g.genre,
    platform: g.platform,
    release: g.release_date
  })).filter((g) => g.image);
  setCached(cacheKey, results, 6 * 60 * 60 * 1000);
  return results;
}

module.exports = {
  searchUnsplashPhotos, searchPexelsPhotos, searchPexelsVideos, searchCategoryPhotos,
  getOmdbMovie, topAnime, topGames
};
