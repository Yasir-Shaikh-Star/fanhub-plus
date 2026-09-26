const { Categories, Content, Characters, Merch } = require('../models');


function originFor(req) {
  const protocol = (req.headers['x-forwarded-proto'] || 'http').split(',')[0].trim();
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `${protocol}://${host}`;
}

module.exports = function registerSeoRoutes(app) {
  app.get('/robots.txt', (req, res) => {
    const origin = originFor(req);
    const body = [
      'User-agent: *',
      'Allow: /',
      'Disallow: /admin',
      'Disallow: /dashboard',
      'Disallow: /profile',
      'Disallow: /login',
      'Disallow: /register',
      'Disallow: /forgot-password',
      'Disallow: /reset-password',
      'Disallow: /api/',
      '',
      `Sitemap: ${origin}/sitemap.xml`,
      ''
    ].join('\n');
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(body);
  });

  app.get('/sitemap.xml', (req, res) => {
    const origin = originFor(req);

    const staticUrls = ['/', '/explore', '/characters', '/articles', '/merch', '/events', '/feedback'];
    const categoryUrls = Categories.all().map((c) => `/explore?category=${c.slug}`);
    const contentUrls = Content.find((c) => c.status === 'approved').map((c) => `/content/${c.id}`);
    const characterUrls = Characters.all().map((c) => `/characters/${c.id}`);
    const merchUrls = Merch.all().map((m) => `/merch/${m.id}`);

    const all = [...staticUrls, ...categoryUrls, ...contentUrls, ...characterUrls, ...merchUrls];
    const urlsXml = all
      .map((u) => `  <url><loc>${origin}${u.replace(/&/g, '&amp;')}</loc></url>`)
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlsXml}\n</urlset>\n`;
    res.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8' });
    res.end(xml);
  });
};
