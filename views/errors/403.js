const { layout, icon } = require('../../core/layout');

module.exports = function forbidden({ user, path }) {
  const body = `
  <section class="section" style="min-height:50vh;display:flex;align-items:center">
    <div class="container empty-state">
      ${icon('shield', { size: 46 })}
      <h1 style="margin-top:14px">Admins only</h1>
      <p>You don't have permission to view this page.</p>
      <a href="/" class="btn btn-primary">${icon('home', { size: 15 })} Back to home</a>
    </div>
  </section>`;
  return layout({ title: 'Forbidden', body, user, path });
};
