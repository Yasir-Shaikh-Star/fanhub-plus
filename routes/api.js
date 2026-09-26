const { Bookmarks, Content, ChatbotFaq, ChatbotLogs } = require('../models');
const { avgRating } = require('../utils/query');
const { reply } = require('../core/chatbot');
const { requireAuth } = require('../middleware/auth');

module.exports = function registerApiRoutes(app) {
  app.post('/api/bookmarks/toggle', requireAuth, (req, res) => {
    const { targetType, targetId } = req.body;
    if (!['content', 'character', 'merch'].includes(targetType) || !targetId) {
      return res.status(400).json({ error: 'invalid target' });
    }
    const existing = Bookmarks.findOne((b) => b.userId === req.user.id && b.targetType === targetType && b.targetId === targetId);
    if (existing) {
      Bookmarks.remove(existing.id);
      return res.json({ bookmarked: false });
    }
    Bookmarks.insert({ userId: req.user.id, targetType, targetId, note: '', createdAt: new Date().toISOString() });
    res.json({ bookmarked: true });
  });

  app.post('/api/content/:id/rate', requireAuth, (req, res) => {
    const item = Content.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'not found' });
    const stars = Math.max(1, Math.min(5, Number(req.body.stars) || 0));
    const ratings = item.ratings.filter((r) => r.userId !== req.user.id);
    ratings.push({ userId: req.user.id, stars });
    Content.update(item.id, { ratings, popularityScore: (item.popularityScore || 0) + 1 });
    res.json({ average: avgRating(ratings), count: ratings.length });
  });

  app.get('/api/chatbot/suggestions', (req, res) => {
    const faqs = ChatbotFaq.all();
    res.json(faqs.slice(0, 6).map((f) => f.question));
  });

  app.post('/api/chatbot/message', (req, res) => {
    const message = (req.body.message || '').slice(0, 500);
    const faqs = ChatbotFaq.all();
    const answer = reply(message, faqs, { userName: req.user ? req.user.name.split(' ')[0] : null });
    ChatbotLogs.insert({
      userId: req.user ? req.user.id : null,
      message,
      response: answer,
      createdAt: new Date().toISOString()
    });
    res.json({ reply: answer });
  });
};
