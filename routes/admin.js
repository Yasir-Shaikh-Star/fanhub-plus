const {
  Users, Categories, Content, Characters, Merch, Events, Feedback, ChatbotFaq, ChatbotLogs
} = require('../models');
const { categoryById, attachCategory, avgRating } = require('../utils/query');
const { requireAuth, requireAdmin } = require('../middleware/auth');

function pendingCount() {
  return Content.count((c) => c.status === 'pending');
}

module.exports = function registerAdminRoutes(app) {
  const guard = [requireAuth, requireAdmin];

  app.get('/admin', ...guard, (req, res) => {
    const categories = Categories.all();
    const contentByCategory = {};
    Content.all().forEach((c) => {
      contentByCategory[c.categoryId] = (contentByCategory[c.categoryId] || 0) + 1;
    });
    const maxCount = Math.max(1, ...Object.values(contentByCategory));
    const popularCategories = categories
      .map((c) => ({ name: c.name, count: contentByCategory[c.id] || 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
      .map((c) => ({ ...c, pct: Math.round((c.count / maxCount) * 100) }));

    res.render('admin/overview', {
      stats: {
        userCount: Users.count(),
        contentCount: Content.count((c) => c.status === 'approved'),
        pendingCount: pendingCount(),
        characterCount: Characters.count(),
        merchCount: Merch.count(),
        eventCount: Events.count(),
        chatbotLogCount: ChatbotLogs.count(),
        openFeedbackCount: Feedback.count((f) => f.status === 'new'),
        popularCategories
      },
      recentFeedback: Feedback.all().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6)
    });
  });

  app.get('/admin/content', ...guard, (req, res) => {
    const items = Content.all().sort((a, b) => (a.status === 'pending' ? -1 : 1) - (b.status === 'pending' ? -1 : 1) || new Date(b.createdAt) - new Date(a.createdAt));
    res.render('admin/contentList', { items: attachCategory(items, 'content'), categories: Categories.all(), pendingCount: pendingCount() });
  });

  app.post('/admin/content', ...guard, (req, res) => {
    const { title, categoryId, type, description, body, mediaUrl } = req.body;
    Content.insert({
      title, categoryId, type: type || 'article', description, body: body || '', mediaUrl: mediaUrl || '',
      status: 'approved', submittedBy: null, ratings: [], popularityScore: 30,
      releaseDate: new Date().toISOString(), createdAt: new Date().toISOString()
    });
    req.session.flash = { type: 'success', text: 'Content added.' };
    res.redirect('/admin/content');
  });

  app.post('/admin/content/:id/approve', ...guard, (req, res) => {
    Content.update(req.params.id, { status: 'approved', createdAt: new Date().toISOString() });
    req.session.flash = { type: 'success', text: 'Submission approved and published.' };
    res.redirect('/admin/content');
  });

  app.post('/admin/content/:id/reject', ...guard, (req, res) => {
    Content.remove(req.params.id);
    req.session.flash = { type: 'info', text: 'Submission rejected and removed.' };
    res.redirect('/admin/content');
  });

  app.post('/admin/content/:id/delete', ...guard, (req, res) => {
    Content.remove(req.params.id);
    req.session.flash = { type: 'info', text: 'Content deleted.' };
    res.redirect('/admin/content');
  });

  app.get('/admin/characters', ...guard, (req, res) => {
    res.render('admin/charactersList', { items: attachCategory(Characters.all(), 'character'), categories: Categories.all(), pendingCount: pendingCount() });
  });

  app.post('/admin/characters', ...guard, (req, res) => {
    const { name, categoryId, affiliation, bio, tags } = req.body;
    Characters.insert({
      name, categoryId, affiliation: affiliation || '', bio,
      tags: (tags || '').split(',').map((t) => t.trim()).filter(Boolean)
    });
    req.session.flash = { type: 'success', text: 'Character added.' };
    res.redirect('/admin/characters');
  });

  app.post('/admin/characters/:id/delete', ...guard, (req, res) => {
    Characters.remove(req.params.id);
    req.session.flash = { type: 'info', text: 'Character removed.' };
    res.redirect('/admin/characters');
  });

  app.get('/admin/merch', ...guard, (req, res) => {
    res.render('admin/merchList', { items: attachCategory(Merch.all(), 'merch'), categories: Categories.all(), pendingCount: pendingCount() });
  });

  app.post('/admin/merch', ...guard, (req, res) => {
    const { name, categoryId, tag, releaseDate, description } = req.body;
    Merch.insert({
      name, categoryId, tag: tag || 'Standard',
      isUpcoming: Boolean(req.body.isUpcoming),
      releaseDate: releaseDate ? new Date(releaseDate).toISOString() : new Date().toISOString(),
      description, viewCount: 0
    });
    req.session.flash = { type: 'success', text: 'Merchandise added.' };
    res.redirect('/admin/merch');
  });

  app.post('/admin/merch/:id/delete', ...guard, (req, res) => {
    Merch.remove(req.params.id);
    req.session.flash = { type: 'info', text: 'Merchandise removed.' };
    res.redirect('/admin/merch');
  });

  app.get('/admin/events', ...guard, (req, res) => {
    res.render('admin/eventsList', { events: Events.all().sort((a, b) => new Date(a.date) - new Date(b.date)), pendingCount: pendingCount() });
  });

  app.post('/admin/events', ...guard, (req, res) => {
    const { title, city, venue, lat, lng, date, type, ticketUrl, description } = req.body;
    Events.insert({
      title, city, venue, lat: Number(lat), lng: Number(lng),
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
      type: type || 'Convention', ticketUrl: ticketUrl || '#', description
    });
    req.session.flash = { type: 'success', text: 'Event added.' };
    res.redirect('/admin/events');
  });

  app.post('/admin/events/:id/delete', ...guard, (req, res) => {
    Events.remove(req.params.id);
    req.session.flash = { type: 'info', text: 'Event removed.' };
    res.redirect('/admin/events');
  });

  app.get('/admin/chatbot', ...guard, (req, res) => {
    res.render('admin/chatbotFaq', { faqs: ChatbotFaq.all(), pendingCount: pendingCount(), logCount: ChatbotLogs.count() });
  });

  app.post('/admin/chatbot', ...guard, (req, res) => {
    const { question, keywords, answer } = req.body;
    ChatbotFaq.insert({
      question, answer,
      keywords: (keywords || '').split(',').map((k) => k.trim()).filter(Boolean),
      category: 'custom'
    });
    req.session.flash = { type: 'success', text: 'FAQ entry added.' };
    res.redirect('/admin/chatbot');
  });

  app.post('/admin/chatbot/:id/delete', ...guard, (req, res) => {
    ChatbotFaq.remove(req.params.id);
    req.session.flash = { type: 'info', text: 'FAQ entry removed.' };
    res.redirect('/admin/chatbot');
  });

  app.get('/admin/feedback', ...guard, (req, res) => {
    res.render('admin/feedbackList', { items: Feedback.all().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), pendingCount: pendingCount() });
  });

  app.post('/admin/feedback/:id/status', ...guard, (req, res) => {
    Feedback.update(req.params.id, { status: req.body.status === 'reviewed' ? 'reviewed' : 'new' });
    res.redirect('/admin/feedback');
  });

  app.get('/admin/users', ...guard, (req, res) => {
    res.render('admin/usersList', { users: Users.all().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), pendingCount: pendingCount() });
  });

  app.post('/admin/users/:id/role', ...guard, (req, res) => {
    if (req.params.id === req.user.id) {
      req.session.flash = { type: 'error', text: "You can't change your own role." };
      return res.redirect('/admin/users');
    }
    Users.update(req.params.id, { role: req.body.role === 'admin' ? 'admin' : 'registered' });
    req.session.flash = { type: 'success', text: 'Role updated.' };
    res.redirect('/admin/users');
  });
};
