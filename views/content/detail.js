const { layout, icon } = require('../../core/layout');
const { bannerArt } = require('../../core/art');
const { starWidget, contentCard } = require('../../core/components');
const { photoFor } = require('../../core/categoryPhotos');

function mediaBlock(item, categorySlug, photo) {
  if (item.type === 'video') {
    return `<div class="media-frame reveal"><video controls poster="" preload="metadata"><source src="${item.mediaUrl}" type="video/mp4">Your browser can't play this video.</video></div>
    <p class="hint" style="margin-top:8px">Demo media clip (open-source sample asset) standing in for licensed footage.</p>`;
  }
  if (item.type === 'audio') {
    return `<div class="media-frame reveal audio-wrap">
      <div style="color:#fff;font-weight:700;margin-bottom:14px;display:flex;align-items:center;gap:8px">${icon('mic', { size: 20 })} ${item.title}</div>
      <audio controls preload="metadata"><source src="${item.mediaUrl}" type="audio/mpeg"></audio>
    </div>
    <p class="hint" style="margin-top:8px">Demo audio clip (open-source sample asset) standing in for licensed audio.</p>`;
  }
  const media = photo && photo.url
    ? `<img src="${photo.url}" alt="${(photo.alt || item.title).replace(/"/g, '&quot;')}" loading="lazy" style="width:100%;height:100%;object-fit:cover">`
    : bannerArt(item.title, categorySlug, { tall: true });
  return `<div class="card-media reveal" style="border-radius:var(--radius-lg);overflow:hidden;aspect-ratio:21/9">${media}</div>`;
}

module.exports = function detail({ user, path, flash, item, category, bookmarked, userStars, related, categoryPhotos = {} }) {
  const categorySlug = category ? category.slug : '';
  const relatedGrid = related.map((r) => contentCard(r.content, r.category, {
    photo: photoFor(r.content.id, r.category ? r.category.slug : '', categoryPhotos)
  })).join('');

  const body = `
  <section class="section">
    <div class="container" style="max-width:900px">
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">
        ${category ? `<span class="tag tag-primary">${category.name}</span>` : ''}
        <span class="tag">${item.type}</span>
        ${item.status === 'pending' ? '<span class="tag badge-pending">Pending review</span>' : ''}
      </div>
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px">
        <h1 class="reveal" style="font-size:2rem;max-width:680px">${item.title}</h1>
        <button class="icon-btn ${bookmarked ? 'is-active' : ''}" data-bookmark-toggle data-target-type="content" data-target-id="${item.id}" aria-label="Bookmark" aria-pressed="${bookmarked}">${icon('bookmark', { size: 18 })}</button>
      </div>
      <p class="lead" style="font-size:1rem;margin-bottom:18px">${item.description}</p>

      ${mediaBlock(item, categorySlug, photoFor(item.id, categorySlug, categoryPhotos))}

      ${item.body ? `<div class="rich-body reveal" style="margin-top:26px">${item.body.split('\n\n').map((p) => `<p>${p}</p>`).join('')}</div>` : ''}

      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:28px;padding-top:20px;border-top:1px solid var(--border)">
        <div>
          <div style="font-size:.78rem;color:var(--text-faint);margin-bottom:6px">Rate this ${item.type}</div>
          ${starWidget(item, { userStars })}
        </div>
        <div style="font-size:.78rem;color:var(--text-faint)">Released ${new Date(item.releaseDate || item.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</div>
      </div>

      ${related.length ? `
      <div class="section-head" style="margin-top:44px"><h2 style="font-size:1.2rem">More from ${category ? category.name : 'this fandom'}</h2></div>
      <div class="grid grid-3">${relatedGrid}</div>` : ''}
    </div>
  </section>`;

  return layout({
    title: item.title,
    body,
    user,
    path,
    flash,
    trail: [{ href: '/', label: 'Home' }, { href: '/explore', label: 'Explore' }, { href: '#', label: item.title }]
  });
};
