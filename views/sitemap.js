const { layout, icon } = require('../core/layout');

module.exports = function sitemap({ user, path, flash, categories }) {
  const catLinks = categories.map((c) => `<li><a href="/explore?category=${c.slug}">${c.name}</a></li>`).join('');
  const body = `
  <section class="section">
    <div class="container">
      <h1 style="font-size:1.6rem">${icon('grid', { size: 20 })} Sitemap</h1>
      <p style="margin-bottom:24px">Every page in Fan Hub Plus, one level deep.</p>
      <ul class="sitemap-list" style="list-style:none;padding:0">
        <li><a href="/">Home</a></li>
        <li><a href="/explore">Explore (content search &amp; filters)</a></li>
        <li><a href="/characters">Character profiles</a></li>
        <li><a href="/articles">Featured articles hub</a></li>
        <li><a href="/articles/submit">Submit fan content</a></li>
        <li><a href="/merch">Merchandise showcase</a></li>
        <li><a href="/events">Event calendar &amp; map</a></li>
        <li><a href="/feedback">Feedback</a></li>
        <li><a href="/dashboard">Dashboard (account)</a></li>
        <li><a href="/profile">Profile settings</a></li>
        <li><a href="/login">Log in</a></li>
        <li><a href="/register">Create account</a></li>
        <li><a href="/forgot-password">Forgot password</a></li>
        ${user && user.role === 'admin' ? '<li><a href="/admin">Admin panel</a></li>' : ''}
        ${catLinks}
      </ul>
    </div>
  </section>`;
  return layout({ title: 'Sitemap', body, user, path, flash, trail: [{ href: '/', label: 'Home' }, { href: '/sitemap', label: 'Sitemap' }] });
};
