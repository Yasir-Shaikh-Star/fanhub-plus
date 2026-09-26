const { Categories, Content, Characters, Events, Feedback } = require('../models');
const { attachCategory, sortItems, bookmarkedIdsFor } = require('../utils/query');
const { requireAuth } = require('../middleware/auth');
const { searchUnsplashPhotos, getOmdbMovie } = require('../core/mediaApi');
const { photosForCategories } = require('../core/categoryPhotos');
const ALL_MOVIE_TITLES = require('../core/curatedMovies');

const CURATED_MOVIE_TITLES = ALL_MOVIE_TITLES.slice(0, 6);

module.exports = function registerPageRoutes(app) {
  app.get('/', async (req, res) => {
    const categories = Categories.all();
    const approved = Content.find((c) => c.status === 'approved');

    const trendingRaw = sortItems(approved, 'popular', (x) => x).slice(0, 8);
    const trending = attachCategory(trendingRaw, 'content');

    const charactersRaw = Characters.all().slice(0, 8);
    const characters = attachCategory(charactersRaw, 'character');

    const now = Date.now();
    const upcomingEvents = Events.find((e) => new Date(e.date).getTime() >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);

    const homeCategorySlugs = categories.map((c) => c.slug);

    const [movieResults, concertPhotos, categoryPhotosResult] = await Promise.allSettled([
      Promise.all(CURATED_MOVIE_TITLES.map((t) => getOmdbMovie(t).catch(() => null))),
      searchUnsplashPhotos('rockstar concert stage lights', 6).catch(() => null),
      photosForCategories(homeCategorySlugs, 6).catch(() => ({}))
    ]);

    const liveMovies = movieResults.status === 'fulfilled' ? movieResults.value.filter(Boolean) : [];
    const livePhotos = concertPhotos.status === 'fulfilled' ? concertPhotos.value : null;
    const categoryPhotos = categoryPhotosResult.status === 'fulfilled' ? categoryPhotosResult.value : {};

    res.render('home', {
      categories,
      trending,
      characters,
      upcomingEvents,
      liveMovies,
      livePhotos,
      categoryPhotos,
      bookmarkedIds: bookmarkedIdsFor(req.user && req.user.id)
    });
  });

  app.get('/sitemap', (req, res) => {
    res.render('sitemap', { categories: Categories.all() });
  });

  app.get('/feedback', (req, res) => {
    res.render('feedback', {});
  });

  app.post('/feedback', (req, res) => {
    const { type, message } = req.body;
    const name = req.user ? req.user.name : req.body.name;
    const email = req.user ? req.user.email : req.body.email;
    if (!message || !name || !email) {
      req.session.flash = { type: 'error', text: 'Please fill in every field.' };
      return res.redirect('/feedback');
    }
    Feedback.insert({
      userId: req.user ? req.user.id : null,
      name,
      email,
      type: ['bug', 'suggestion', 'query'].includes(type) ? type : 'query',
      message,
      status: 'new',
      createdAt: new Date().toISOString()
    });
    req.session.flash = { type: 'success', text: 'Thanks! Your feedback reached the admin team.' };
    res.redirect('/feedback');
  });
};
