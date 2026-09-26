const { Characters, Categories } = require('../models');
const { categoryById, attachCategory, bookmarkedIdsFor } = require('../utils/query');
const { photosForCategories } = require('../core/categoryPhotos');

module.exports = function registerCharacterRoutes(app) {
  app.get('/characters', async (req, res) => {
    const { q, category } = req.query;
    let items = Characters.all();
    if (category) {
      const cat = Categories.findOne((c) => c.slug === category);
      items = items.filter((c) => cat && c.categoryId === cat.id);
    }
    if (q) {
      const needle = q.toLowerCase();
      items = items.filter((c) => c.name.toLowerCase().includes(needle) || c.bio.toLowerCase().includes(needle));
    }
    const attached = attachCategory(items, 'character');
    const slugsOnPage = attached.map((it) => it.category && it.category.slug).filter(Boolean);
    const categoryPhotos = await photosForCategories(slugsOnPage, 8).catch(() => ({}));

    res.render('characters/list', {
      items: attached,
      categories: Categories.all(),
      query: req.query,
      categoryPhotos,
      bookmarkedIds: bookmarkedIdsFor(req.user && req.user.id)
    });
  });

  app.get('/characters/:id', async (req, res) => {
    const character = Characters.findById(req.params.id);
    if (!character) return res.status(404).render('errors/404', {});
    const category = categoryById(character.categoryId);
    const related = attachCategory(
      Characters.find((c) => c.categoryId === character.categoryId && c.id !== character.id).slice(0, 4),
      'character'
    );
    const categoryPhotos = category ? await photosForCategories([category.slug], 8).catch(() => ({})) : {};

    res.render('characters/detail', {
      character,
      category,
      bookmarked: bookmarkedIdsFor(req.user && req.user.id).includes(character.id),
      related,
      categoryPhotos
    });
  });
};
