const { searchUnsplashPhotos, searchPexelsPhotos, searchPexelsVideos, getOmdbMovie } = require('../core/mediaApi');

module.exports = function registerMediaRoutes(app) {
  app.get('/api/media/photos', async (req, res) => {
    const q = (req.query.q || 'anime concert').slice(0, 80);
    const source = req.query.source === 'pexels' ? 'pexels' : 'unsplash';
    try {
      const photos = source === 'pexels'
        ? await searchPexelsPhotos(q, Math.min(Number(req.query.count) || 6, 12))
        : await searchUnsplashPhotos(q, Math.min(Number(req.query.count) || 6, 12));
      res.json({ photos });
    } catch (err) {
      res.status(502).json({ error: 'photo lookup failed', detail: err.message, photos: [] });
    }
  });

  app.get('/api/media/videos', async (req, res) => {
    const q = (req.query.q || 'anime city night').slice(0, 80);
    try {
      const videos = await searchPexelsVideos(q, Math.min(Number(req.query.count) || 3, 5));
      res.json({ videos });
    } catch (err) {
      res.status(502).json({ error: 'video lookup failed', detail: err.message, videos: [] });
    }
  });

  app.get('/api/media/movie', async (req, res) => {
    const title = (req.query.title || req.query.i || '').slice(0, 100);
    if (!title) return res.status(400).json({ error: 'title or i (imdb id) is required' });
    try {
      const movie = await getOmdbMovie(title);
      if (!movie) return res.status(404).json({ error: 'not found' });
      res.json({ movie });
    } catch (err) {
      res.status(502).json({ error: 'movie lookup failed', detail: err.message });
    }
  });
};
