const { layout, icon } = require('../../core/layout');
const { contentCard, emptyState } = require('../../core/components');
const { photoFor } = require('../../core/categoryPhotos');

module.exports = function articlesHub({ user, path, flash, items, categories, query, highlights, categoryPhotos = {}, bookmarkedIds = [], mySubmissions = [] }) {
  const catOptions = categories.map((c) => `<option value="${c.slug}" ${query.category === c.slug ? 'selected' : ''}>${c.name}</option>`).join('');
  const grid = items.length
    ? items.map((it) => contentCard(it.content, it.category, {
        bookmarked: bookmarkedIds.includes(it.content.id),
        photo: photoFor(it.content.id, it.category ? it.category.slug : '', categoryPhotos)
      })).join('')
    : emptyState('No articles in this fandom yet.', 'book');

  const timeline = highlights
    .map(
      (ev, i) => `<div style="display:flex;gap:16px;padding:14px 0;border-left:2px solid var(--border);padding-left:22px;position:relative" data-reveal>
      <span style="position:absolute;left:-9px;top:18px;width:16px;height:16px;border-radius:50%;background:var(--primary);border:3px solid var(--surface)"></span>
      <div>
        <div style="font-size:.76rem;color:var(--text-faint);font-weight:700;text-transform:uppercase;letter-spacing:.04em">${new Date(ev.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} &middot; ${ev.type}</div>
        <div style="font-weight:700;margin:2px 0">${ev.title}</div>
        <div style="font-size:.85rem;color:var(--text-dim)">${ev.description} &mdash; ${ev.city}</div>
      </div>
    </div>`
    )
    .join('');

  const mySubmissionsList = mySubmissions.length
    ? `<div class="form-card" style="margin-bottom:28px">
        <h3 style="font-size:.95rem;margin-bottom:10px">${icon('clock', { size: 15 })} Your submissions</h3>
        ${mySubmissions.map((s) => `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border)">
          <span>${s.title}</span><span class="tag ${s.status === 'approved' ? 'tag-success' : s.status === 'pending' ? 'badge-pending' : 'tag'}">${s.status}</span>
        </div>`).join('')}
      </div>`
    : '';

  const body = `
  <section class="section">
    <div class="container">
      <div class="section-head">
        <div><h1 style="font-size:1.7rem">${icon('book', { size: 22 })} Featured Articles Hub</h1><p>Rich, long-form coverage &mdash; plus the community's own contributions.</p></div>
        ${user ? `<a href="/articles/submit" class="btn btn-primary btn-sm">${icon('plus', { size: 15 })} Submit fan content</a>` : `<a href="/login" class="btn btn-outline btn-sm">${icon('plus', { size: 15 })} Log in to submit</a>`}
      </div>

      ${mySubmissionsList}

      <div class="section-head" style="margin-top:6px"><h2 style="font-size:1.1rem">${icon('calendar', { size: 17 })} Event highlights</h2></div>
      <div style="max-width:640px;margin-bottom:40px">${timeline}</div>

      <form method="GET" action="/articles" class="toolbar form-card" style="padding:16px 18px">
        <div class="input-icon-wrap search-box">${icon('search', { size: 16 })}<input type="search" name="q" placeholder="Search articles..." value="${query.q || ''}"></div>
        <select name="category" data-autosubmit><option value="">All fandoms</option>${catOptions}</select>
        <button type="submit" class="btn btn-primary btn-sm">${icon('filter', { size: 14 })} Apply</button>
      </form>
      <div class="grid grid-3" style="margin-top:20px">${grid}</div>
    </div>
  </section>`;

  return layout({ title: 'Articles', body, user, path, flash, trail: [{ href: '/', label: 'Home' }, { href: '/articles', label: 'Articles' }] });
};
