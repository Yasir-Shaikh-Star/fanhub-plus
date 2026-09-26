const { Events } = require('../models');

module.exports = function registerEventRoutes(app) {
  app.get('/events', (req, res) => {
    const events = Events.all().sort((a, b) => new Date(a.date) - new Date(b.date));
    const cities = [...new Set(events.map((e) => e.city))].sort();
    res.render('events/list', { events, cities });
  });
};
