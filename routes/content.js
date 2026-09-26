const { Content, Categories } = require('../models');
const { categoryById, attachCategory, sortItems, bookmarkedIdsFor } = require('../utils/query');
const { photosForCategories } = require('../core/categoryPhotos');
const { getOmdbMovie, topAnime, topGames } = require('../core/mediaApi');
const ALL_MOVIE_TITLES = require('../core/curatedMovies');

const LIVE_SECTION_FETCHERS = {
  movies: {
    fetch: () => Promise.all(ALL_MOVIE_TITLES.map((t) => getOmdbMovie(t).catch(() => null))).then((l) => l.filter(Boolean)),
    normalize: (m) => ({ title: m.title, image: m.poster, badge: m.rating, meta: m.genre || m.year, synopsis: m.plot })
  },
  anime: {
    fetch: () => topAnime(12),
    normalize: (a) => ({ title: a.title, image: a.image, badge: a.rating, meta: a.genre || `${a.episodes || '?'} episodes`, synopsis: a.synopsis })
  },
  gaming: {
    fetch: () => topGames(12),
    normalize: (g) => ({ title: g.title, image: g.image, badge: g.genre, meta: g.platform, synopsis: g.synopsis })
  }
};

module.exports = function registerContentRoutes(app) {
  app.get('/explore', async (req, res) => {
    const { q, category, type, sort } = req.query;
    let items = Content.find((c) => c.status === 'approved');

    if (category) {
      const cat = Categories.findOne((c) => c.slug === category);
      items = items.filter((c) => cat && c.categoryId === cat.id);
    }
    if (type) items = items.filter((c) => c.type === type);
    if (q) {
      const needle = q.toLowerCase();
      items = items.filter((c) => c.title.toLowerCase().includes(needle) || (c.description || '').toLowerCase().includes(needle));
    }

    items = sortItems(items, sort, (x) => x);
    const attached = attachCategory(items, 'content');

    const slugsOnPage = attached.map((it) => it.category && it.category.slug).filter(Boolean);

    const liveSectionSource = LIVE_SECTION_FETCHERS[category];

    const [categoryPhotos, liveSectionRaw] = await Promise.all([
      photosForCategories(slugsOnPage, 8).catch(() => ({})),
      liveSectionSource ? liveSectionSource.fetch().catch(() => []) : Promise.resolve([])
    ]);
    const liveSection = liveSectionSource ? liveSectionRaw.map(liveSectionSource.normalize) : [];

    res.render('content/explore', {
      items: attached,
      categories: Categories.all(),
      query: req.query,
      categoryPhotos,
      liveSection,
      bookmarkedIds: bookmarkedIdsFor(req.user && req.user.id)
    });
  });

  app.get('/content/:id', async (req, res) => {
    const item = Content.findById(req.params.id);
    if (!item || (item.status !== 'approved' && !(req.user && (req.user.role === 'admin' || req.user.id === item.submittedBy)))) {
      return res.status(404).render('errors/404', {});
    }
    const category = categoryById(item.categoryId);
    const related = attachCategory(
      Content.find((c) => c.categoryId === item.categoryId && c.id !== item.id && c.status === 'approved').slice(0, 3),
      'content'
    );
    const bookmarkedIds = bookmarkedIdsFor(req.user && req.user.id);
    const userStars = req.user ? (item.ratings.find((r) => r.userId === req.user.id) || {}).stars || 0 : 0;
    const categoryPhotos = category ? await photosForCategories([category.slug], 8).catch(() => ({})) : {};

    res.render('content/detail', {
      item,
      category,
      bookmarked: bookmarkedIds.includes(item.id),
      userStars,
      related,
      categoryPhotos
    });
  });
};
