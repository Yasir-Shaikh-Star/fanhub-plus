const { Categories, Content, Characters, Merch, Bookmarks } = require('../models');
const { categoryById, sortItems } = require('../utils/query');
const { requireAuth } = require('../middleware/auth');
const { photosForCategories } = require('../core/categoryPhotos');

module.exports = function registerDashboardRoutes(app) {
  app.get('/dashboard', requireAuth, async (req, res) => {
    const favoriteCategories = (req.user.favoriteCategories || []).map(categoryById).filter(Boolean);
    const favIds = favoriteCategories.map((c) => c.id);

    let recent = Content.find((c) => c.status === 'approved' && favIds.includes(c.categoryId));
    if (!recent.length) recent = Content.find((c) => c.status === 'approved');
    recent = sortItems(recent, 'latest', (x) => x).slice(0, 6);
    const recentContent = recent.map((c) => ({ content: c, category: categoryById(c.categoryId) }));

    const userBookmarks = Bookmarks.find((b) => b.userId === req.user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const bookmarks = userBookmarks
      .map((b) => {
        if (b.targetType === 'content') {
          const item = Content.findById(b.targetId);
          return item ? { kind: 'content', item, category: categoryById(item.categoryId) } : null;
        }
        if (b.targetType === 'character') {
          const item = Characters.findById(b.targetId);
          return item ? { kind: 'character', item, category: categoryById(item.categoryId) } : null;
        }
        const item = Merch.findById(b.targetId);
        return item ? { kind: 'merch', item, category: categoryById(item.categoryId) } : null;
      })
      .filter(Boolean)
      .slice(0, 8);

    const slugsOnPage = Array.from(new Set(
      [...recentContent, ...bookmarks]
        .map((r) => (r.category ? r.category.slug : null))
        .filter(Boolean)
    ));
    const categoryPhotos = slugsOnPage.length ? await photosForCategories(slugsOnPage, 8).catch(() => ({})) : {};

    res.render('dashboard/dashboard', {
      favoriteCategories,
      recentContent,
      bookmarks,
      categoryPhotos,
      stats: { bookmarkCount: userBookmarks.length }
    });
  });
};
