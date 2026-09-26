const { Merch, Categories } = require('../models');
const { categoryById, attachCategory, bookmarkedIdsFor } = require('../utils/query');
const { photosForCategories } = require('../core/categoryPhotos');

module.exports = function registerMerchRoutes(app) {
  app.get('/merch', async (req, res) => {
    const { q, category, tag } = req.query;
    let items = Merch.all();
    if (category) {
      const cat = Categories.findOne((c) => c.slug === category);
      items = items.filter((c) => cat && c.categoryId === cat.id);
    }
    if (tag) items = items.filter((c) => c.tag === tag);
    if (q) {
      const needle = q.toLowerCase();
      items = items.filter((c) => c.name.toLowerCase().includes(needle) || c.description.toLowerCase().includes(needle));
    }
    const attached = attachCategory(items, 'merch');
    const upcoming = attachCategory(
      Merch.find((m) => m.isUpcoming).sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate)).slice(0, 6),
      'merch'
    );

    const slugsOnPage = [...attached, ...upcoming].map((it) => it.category && it.category.slug).filter(Boolean);
    const categoryPhotos = await photosForCategories(slugsOnPage, 8).catch(() => ({}));

    res.render('merch/list', {
      items: attached,
      upcoming,
      categories: Categories.all(),
      query: req.query,
      categoryPhotos,
      bookmarkedIds: bookmarkedIdsFor(req.user && req.user.id)
    });
  });

  app.get('/merch/:id', async (req, res) => {
    const item = Merch.findById(req.params.id);
    if (!item) return res.status(404).render('errors/404', {});
    Merch.update(item.id, { viewCount: (item.viewCount || 0) + 1 });
    const category = categoryById(item.categoryId);
    const related = attachCategory(
      Merch.find((m) => m.categoryId === item.categoryId && m.id !== item.id).slice(0, 4),
      'merch'
    );
    const categoryPhotos = category ? await photosForCategories([category.slug], 8).catch(() => ({})) : {};

    res.render('merch/detail', {
      item,
      category,
      bookmarked: bookmarkedIdsFor(req.user && req.user.id).includes(item.id),
      related,
      categoryPhotos
    });
  });
};
