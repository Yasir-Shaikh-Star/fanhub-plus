const { layout, icon } = require('../../core/layout');

module.exports = function submitArticle({ user, path, flash, categories, form = {} }) {
  const catOptions = categories.map((c) => `<option value="${c.id}" ${form.categoryId === c.id ? 'selected' : ''}>${c.name}</option>`).join('');

  const body = `
  <section class="section">
    <div class="container" style="max-width:640px">
      <div class="form-card reveal">
        <h1 style="font-size:1.4rem;margin-bottom:4px">${icon('plus', { size: 20 })} Submit fan content</h1>
        <p style="margin-bottom:20px">Your article goes to an admin for review before it appears on the Articles hub.</p>
        <form method="POST" action="/articles/submit">
          <div class="field">
            <label for="title">Title</label>
            <input type="text" id="title" name="title" value="${form.title || ''}" required>
          </div>
          <div class="field">
            <label for="categoryId">Fandom</label>
            <select id="categoryId" name="categoryId" required><option value="">Choose a category</option>${catOptions}</select>
          </div>
          <div class="field">
            <label for="description">Short summary</label>
            <input type="text" id="description" name="description" maxlength="180" value="${form.description || ''}" required>
          </div>
          <div class="field">
            <label for="body">Full article</label>
            <textarea id="body" name="body" rows="8" required>${form.body || ''}</textarea>
          </div>
          <button type="submit" class="btn btn-primary">${icon('send', { size: 15 })} Submit for review</button>
        </form>
      </div>
    </div>
  </section>`;

  return layout({ title: 'Submit fan content', body, user, path, flash, trail: [{ href: '/', label: 'Home' }, { href: '/articles', label: 'Articles' }, { href: '/articles/submit', label: 'Submit' }] });
};
