const { layout, icon } = require('../../core/layout');

module.exports = function notFound({ user, path }) {
  const body = `
  <section class="section" style="min-height:50vh;display:flex;align-items:center">
    <div class="container empty-state">
      ${icon('compass', { size: 46, class: 'icon-spin' })}
      <h1 style="margin-top:14px">Lost in the multiverse</h1>
      <p>We couldn't find that page. It might have moved, or never existed here.</p>
      <a href="/" class="btn btn-primary">${icon('home', { size: 15 })} Back to home</a>
    </div>
  </section>`;
  return layout({ title: 'Not found', body, user, path });
};
