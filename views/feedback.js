const { layout, icon } = require('../core/layout');

module.exports = function feedback({ user, path, flash }) {
  const body = `
  <section class="section">
    <div class="container" style="max-width:560px">
      <div class="form-card reveal">
        <h1 style="font-size:1.4rem;margin-bottom:4px">${icon('chat', { size: 20 })} Feedback</h1>
        <p style="margin-bottom:20px">Bug, suggestion, or general question &mdash; it goes straight to the admin team.</p>
        <form method="POST" action="/feedback">
          ${!user ? `
          <div class="field"><label for="name">Name</label><input type="text" id="name" name="name" required></div>
          <div class="field"><label for="email">Email</label><input type="email" id="email" name="email" required></div>
          ` : ''}
          <div class="field">
            <label>Type</label>
            <div class="pill-select">
              <label><input type="radio" name="type" value="bug" checked><span>${icon('info', { size: 13 })} Bug</span></label>
              <label><input type="radio" name="type" value="suggestion"><span>${icon('sparkles', { size: 13 })} Suggestion</span></label>
              <label><input type="radio" name="type" value="query"><span>${icon('chat', { size: 13 })} Question</span></label>
            </div>
          </div>
          <div class="field">
            <label for="message">Message</label>
            <textarea id="message" name="message" rows="5" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary">${icon('send', { size: 15 })} Send feedback</button>
        </form>
      </div>
    </div>
  </section>`;
  return layout({ title: 'Feedback', body, user, path, flash, trail: [{ href: '/', label: 'Home' }, { href: '/feedback', label: 'Feedback' }] });
};
