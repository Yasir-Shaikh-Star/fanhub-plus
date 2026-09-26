const { Content, Categories, Events } = require('../models');
const { attachCategory, bookmarkedIdsFor } = require('../utils/query');
const { requireAuth } = require('../middleware/auth');
const { photosForCategories } = require('../core/categoryPhotos');

module.exports = function registerArticleRoutes(app) {
  app.get('/articles', async (req, res) => {
    const { q, category } = req.query;
    let items = Content.find((c) => c.type === 'article' && c.status === 'approved');
    if (category) {
      const cat = Categories.findOne((c) => c.slug === category);
      items = items.filter((c) => cat && c.categoryId === cat.id);
    }
    if (q) {
      const needle = q.toLowerCase();
      items = items.filter((c) => c.title.toLowerCase().includes(needle) || c.description.toLowerCase().includes(needle));
    }
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const attached = attachCategory(items, 'content');

    const highlights = Events.all().sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5);
    const mySubmissions = req.user ? Content.find((c) => c.submittedBy === req.user.id) : [];

    const slugsOnPage = attached.map((it) => it.category && it.category.slug).filter(Boolean);
    const categoryPhotos = await photosForCategories(slugsOnPage, 8).catch(() => ({}));

    res.render('articles/hub', {
      items: attached,
      categories: Categories.all(),
      query: req.query,
      highlights,
      categoryPhotos,
      bookmarkedIds: bookmarkedIdsFor(req.user && req.user.id),
      mySubmissions
    });
  });

  app.get('/articles/submit', requireAuth, (req, res) => {
    res.render('articles/submit', { categories: Categories.all(), form: {} });
  });

  app.post('/articles/submit', requireAuth, (req, res) => {
    const { title, categoryId, description, body } = req.body;
    if (!title || !categoryId || !description || !body) {
      req.session.flash = { type: 'error', text: 'Please fill in every field.' };
      return res.render('articles/submit', { categories: Categories.all(), form: req.body });
    }
    Content.insert({
      categoryId,
      title,
      type: 'article',
      description,
      body,
      status: 'pending',
      submittedBy: req.user.id,
      ratings: [],
      popularityScore: 0,
      releaseDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    });
    req.session.flash = { type: 'success', text: 'Thanks! Your article was submitted for admin review.' };
    res.redirect('/articles');
  });
};
