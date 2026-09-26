const { layout, icon } = require('../../core/layout');
const { bannerArt } = require('../../core/art');
const { characterCard } = require('../../core/components');
const { photoFor } = require('../../core/categoryPhotos');

module.exports = function characterDetail({ user, path, flash, character, category, bookmarked, related, categoryPhotos = {} }) {
  const tagList = (character.tags || []).map((t) => `<span class="tag">${t}</span>`).join(' ');
  const relatedGrid = related.map((r) => characterCard(r.character, r.category, {
    photo: photoFor(r.character.id, r.category ? r.category.slug : '', categoryPhotos)
  })).join('');
  const heroPhoto = photoFor(character.id, category ? category.slug : '', categoryPhotos);
  const heroMedia = heroPhoto && heroPhoto.url
    ? `<img src="${heroPhoto.url}" alt="${(heroPhoto.alt || character.name).replace(/"/g, '&quot;')}" loading="lazy" style="width:100%;height:100%;object-fit:cover">`
    : bannerArt(character.name, category ? category.slug : '');

  const body = `
  <section class="section">
    <div class="container" style="max-width:820px">
      <div class="grid" style="grid-template-columns:260px 1fr;gap:28px" class="reveal">
        <div style="aspect-ratio:1;border-radius:var(--radius-lg);overflow:hidden">${heroMedia}</div>
        <div>
          <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap">${category ? `<span class="tag tag-primary">${category.name}</span>` : ''} ${tagList}</div>
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px">
            <h1 style="font-size:1.9rem">${character.name}</h1>
            <button class="icon-btn ${bookmarked ? 'is-active' : ''}" data-bookmark-toggle data-target-type="character" data-target-id="${character.id}" aria-label="Bookmark" aria-pressed="${bookmarked}">${icon('bookmark', { size: 18 })}</button>
          </div>
          <p style="font-size:.9rem;color:var(--text-faint);margin-bottom:14px">${character.affiliation || ''}</p>
          <p style="font-size:1.02rem;color:var(--text)">${character.bio}</p>
        </div>
      </div>

      ${related.length ? `<div class="section-head" style="margin-top:44px"><h2 style="font-size:1.2rem">More characters from ${category ? category.name : 'this fandom'}</h2></div>
      <div class="grid grid-4">${relatedGrid}</div>` : ''}
    </div>
  </section>`;

  return layout({ title: character.name, body, user, path, flash, trail: [{ href: '/', label: 'Home' }, { href: '/characters', label: 'Characters' }, { href: '#', label: character.name }] });
};
