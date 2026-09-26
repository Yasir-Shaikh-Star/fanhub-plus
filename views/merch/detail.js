const { layout, icon } = require('../../core/layout');
const { bannerArt } = require('../../core/art');
const { merchCard } = require('../../core/components');
const { photoFor } = require('../../core/categoryPhotos');

module.exports = function merchDetail({ user, path, flash, item, category, bookmarked, related, categoryPhotos = {} }) {
  const relatedGrid = related.map((r) => merchCard(r.merch, r.category, {
    photo: photoFor(r.merch.id, r.category ? r.category.slug : '', categoryPhotos)
  })).join('');
  const heroPhoto = photoFor(item.id, category ? category.slug : '', categoryPhotos);
  const heroMedia = heroPhoto && heroPhoto.url
    ? `<img src="${heroPhoto.url}" alt="${(heroPhoto.alt || item.name).replace(/"/g, '&quot;')}" loading="lazy" style="width:100%;height:100%;object-fit:cover">`
    : bannerArt(item.name, category ? category.slug : '');
  const body = `
  <section class="section">
    <div class="container" style="max-width:900px">
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:28px">
        <div style="aspect-ratio:1;border-radius:var(--radius-lg);overflow:hidden" class="reveal">${heroMedia}</div>
        <div class="reveal">
          <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap">
            ${category ? `<span class="tag tag-primary">${category.name}</span>` : ''}
            <span class="tag tag-warm">${item.tag}</span>
            ${item.isUpcoming ? '<span class="tag">Upcoming</span>' : ''}
          </div>
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
            <h1 style="font-size:1.7rem">${item.name}</h1>
            <button class="icon-btn ${bookmarked ? 'is-active' : ''}" data-bookmark-toggle data-target-type="merch" data-target-id="${item.id}" aria-label="Bookmark" aria-pressed="${bookmarked}">${icon('bookmark', { size: 18 })}</button>
          </div>
          <p style="margin:10px 0 20px">${item.description}</p>
          <div style="display:flex;gap:20px;font-size:.85rem;color:var(--text-faint)">
            <span>${icon('calendar', { size: 14 })} ${item.isUpcoming ? 'Releases' : 'Released'} ${new Date(item.releaseDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span>${icon('eye', { size: 14 })} ${item.viewCount} views</span>
          </div>
          <div class="flash info" style="position:static;margin-top:22px">${icon('info', { size: 16 })}<span>This is a discovery showcase, not a store &mdash; there's no checkout in Fan Hub Plus. Look for official pre-order/ticket links where provided.</span></div>
        </div>
      </div>

      ${related.length ? `<div class="section-head" style="margin-top:44px"><h2 style="font-size:1.2rem">More merch from ${category ? category.name : 'this fandom'}</h2></div>
      <div class="grid grid-4">${relatedGrid}</div>` : ''}
    </div>
  </section>`;

  return layout({ title: item.name, body, user, path, flash, trail: [{ href: '/', label: 'Home' }, { href: '/merch', label: 'Merch' }, { href: '#', label: item.name }] });
};
