const { layout, icon } = require('../../core/layout');
const { characterCard, emptyState } = require('../../core/components');
const { photoFor } = require('../../core/categoryPhotos');

module.exports = function charactersList({ user, path, flash, items, categories, query, categoryPhotos = {}, bookmarkedIds = [] }) {
  const catOptions = categories.map((c) => `<option value="${c.slug}" ${query.category === c.slug ? 'selected' : ''}>${c.name}</option>`).join('');
  const grid = items.length
    ? items.map((it) => characterCard(it.character, it.category, {
        bookmarked: bookmarkedIds.includes(it.character.id),
        photo: photoFor(it.character.id, it.category ? it.category.slug : '', categoryPhotos)
      })).join('')
    : emptyState('No characters found for this filter yet.', 'users');

  const body = `
  <section class="section">
    <div class="container">
      <div class="section-head">
        <div><h1 style="font-size:1.7rem">${icon('users', { size: 22 })} Character Profiles</h1><p>Card-based profiles across every fandom, filterable by category.</p></div>
      </div>
      <form method="GET" action="/characters" class="toolbar form-card" style="padding:16px 18px">
        <div class="input-icon-wrap search-box">${icon('search', { size: 16 })}<input type="search" name="q" placeholder="Search characters..." value="${query.q || ''}"></div>
        <select name="category" data-autosubmit><option value="">All fandoms</option>${catOptions}</select>
        <button type="submit" class="btn btn-primary btn-sm">${icon('filter', { size: 14 })} Apply</button>
      </form>
      <div class="grid grid-4" style="margin-top:20px">${grid}</div>
    </div>
  </section>`;

  return layout({ title: 'Characters', body, user, path, flash, trail: [{ href: '/', label: 'Home' }, { href: '/characters', label: 'Characters' }] });
};
