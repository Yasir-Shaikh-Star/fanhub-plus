const { layout, icon } = require('../../core/layout');
const { merchCard, emptyState } = require('../../core/components');
const { photoFor } = require('../../core/categoryPhotos');

module.exports = function merchList({ user, path, flash, items, upcoming, categories, query, categoryPhotos = {}, bookmarkedIds = [] }) {
  const catOptions = categories.map((c) => `<option value="${c.slug}" ${query.category === c.slug ? 'selected' : ''}>${c.name}</option>`).join('');
  const tagOptions = ['Limited Edition', 'Pre-Order', 'Collectible', 'Standard']
    .map((t) => `<option value="${t}" ${query.tag === t ? 'selected' : ''}>${t}</option>`)
    .join('');

  const grid = items.length
    ? items.map((it) => merchCard(it.merch, it.category, {
        bookmarked: bookmarkedIds.includes(it.merch.id),
        photo: photoFor(it.merch.id, it.category ? it.category.slug : '', categoryPhotos)
      })).join('')
    : emptyState('No merchandise matches those filters.', 'shirt');

  const upcomingStrip = upcoming.length
    ? `<div style="display:flex;gap:14px;overflow-x:auto;padding-bottom:8px">${upcoming
        .map(
          (u) => `<div style="min-width:220px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px;flex-shrink:0" data-reveal>
          <span class="tag tag-warm">${icon('clock', { size: 11 })} ${new Date(u.merch.releaseDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
          <div style="font-weight:700;margin-top:8px;font-size:.9rem"><a href="/merch/${u.merch.id}">${u.merch.name}</a></div>
          <div style="font-size:.78rem;color:var(--text-faint)">${u.category ? u.category.name : ''}</div>
        </div>`
        )
        .join('')}</div>`
    : '';

  const body = `
  <section class="section">
    <div class="container">
      <div class="section-head">
        <div><h1 style="font-size:1.7rem">${icon('shirt', { size: 22 })} Merchandise Showcase &amp; Resource Library</h1><p>Discovery only &mdash; no checkout here. Links point to the official source.</p></div>
      </div>

      ${upcoming.length ? `<div class="section-head" style="margin-top:4px"><h2 style="font-size:1.05rem">${icon('clock', { size: 16 })} Upcoming releases</h2></div>${upcomingStrip}<hr class="divider">` : ''}

      <form method="GET" action="/merch" class="toolbar form-card" style="padding:16px 18px">
        <div class="input-icon-wrap search-box">${icon('search', { size: 16 })}<input type="search" name="q" placeholder="Search merch..." value="${query.q || ''}"></div>
        <select name="category" data-autosubmit><option value="">All fandoms</option>${catOptions}</select>
        <select name="tag" data-autosubmit><option value="">All tags</option>${tagOptions}</select>
        <button type="submit" class="btn btn-primary btn-sm">${icon('filter', { size: 14 })} Apply</button>
      </form>
      <div class="grid grid-4" style="margin-top:20px">${grid}</div>
    </div>
  </section>`;

  return layout({ title: 'Merchandise', body, user, path, flash, trail: [{ href: '/', label: 'Home' }, { href: '/merch', label: 'Merch' }] });
};
