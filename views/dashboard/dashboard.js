const { layout, icon, avatarArt } = require('../../core/layout');
const { contentCard, characterCard, merchCard, emptyState } = require('../../core/components');
const { photoFor } = require('../../core/categoryPhotos');

module.exports = function dashboard({ user, path, flash, favoriteCategories, recentContent, bookmarks, categoryPhotos = {}, stats }) {
  const catTags = favoriteCategories.length
    ? favoriteCategories.map((c) => `<span class="tag tag-primary">${c.name}</span>`).join(' ')
    : `<span class="hint">No favorite fandoms yet &mdash; <a href="/profile" style="color:var(--primary)">pick some</a>.</span>`;

  const recentGrid = recentContent.length
    ? recentContent.map((r) => contentCard(r.content, r.category, {
        photo: photoFor(r.content.id, r.category ? r.category.slug : '', categoryPhotos)
      })).join('')
    : emptyState('Nothing new in your favorite fandoms yet. Explore to find something.');

  const bookmarkItems = bookmarks.length
    ? bookmarks
        .map((b) => {
          const photo = photoFor(b.item.id, b.category ? b.category.slug : '', categoryPhotos);
          if (b.kind === 'content') return contentCard(b.item, b.category, { bookmarked: true, photo });
          if (b.kind === 'character') return characterCard(b.item, b.category, { bookmarked: true, photo });
          return merchCard(b.item, b.category, { bookmarked: true, photo });
        })
        .join('')
    : emptyState('Nothing bookmarked yet. Tap the bookmark icon on anything you like.', 'bookmark');

  const body = `
  <section class="section">
    <div class="container">
      <div class="dash-grid">
        <aside class="side-panel reveal">
          <div class="profile-avatar-lg">${user.avatar ? `<img src="${user.avatar}" alt="">` : avatarArt(user.id, user.name)}</div>
          <h3 style="text-align:center;margin-bottom:2px">${user.name}</h3>
          <p style="text-align:center;font-size:.82rem">${user.bio || 'No bio yet.'}</p>
          <hr class="divider">
          <div style="display:flex;flex-direction:column;gap:10px">
            <div class="stat-tile" style="padding:14px">
              <span class="stat-icon" style="background:var(--primary)">${icon('bookmark', { size: 16 })}</span>
              <span class="stat-num">${stats.bookmarkCount}</span><span class="stat-label">Bookmarks</span>
            </div>
            <div class="stat-tile" style="padding:14px">
              <span class="stat-icon" style="background:var(--accent)">${icon('sparkles', { size: 16 })}</span>
              <span class="stat-num">${favoriteCategories.length}</span><span class="stat-label">Favorite fandoms</span>
            </div>
          </div>
          <a href="/profile" class="btn btn-outline btn-block" style="margin-top:16px">${icon('edit', { size: 15 })} Edit profile</a>
        </aside>

        <div>
          <div class="form-card reveal" style="margin-bottom:24px;background:linear-gradient(120deg, var(--primary-tint), transparent)">
            <h2 style="margin-bottom:4px">Welcome back, ${user.name.split(' ')[0]}.</h2>
            <p style="margin-bottom:12px">Your favorite fandoms: ${catTags}</p>
          </div>

          <div class="section-head" style="margin-bottom:14px">
            <h2 style="font-size:1.2rem">Fresh in your fandoms</h2>
            <a href="/explore" class="btn btn-ghost btn-sm">Explore all ${icon('arrowRight', { size: 14 })}</a>
          </div>
          <div class="grid grid-3" style="margin-bottom:36px">${recentGrid}</div>

          <div class="section-head" style="margin-bottom:14px">
            <h2 style="font-size:1.2rem">${icon('bookmark', { size: 18 })} Your bookmarks</h2>
          </div>
          <div class="grid grid-3">${bookmarkItems}</div>
        </div>
      </div>
    </div>
  </section>`;

  return layout({ title: 'Dashboard', body, user, path, flash, trail: [{ href: '/', label: 'Home' }, { href: '/dashboard', label: 'Dashboard' }] });
};
