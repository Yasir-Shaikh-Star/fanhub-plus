const { layout, icon, avatarArt } = require('../../core/layout');

module.exports = function profile({ user, path, flash, categories }) {
  const catPills = categories
    .map((c) => `<label><input type="checkbox" name="favoriteCategories" value="${c.id}" ${(user.favoriteCategories || []).includes(c.id) ? 'checked' : ''}><span>${c.name}</span></label>`)
    .join('');

  const body = `
  <section class="section">
    <div class="container" style="max-width:640px">
      <div class="form-card reveal">
        <h1 style="font-size:1.4rem;margin-bottom:4px">Profile settings</h1>
        <p style="margin-bottom:20px">Update how you appear and what Fan Hub Plus shows you first.</p>

        <form method="POST" action="/profile" id="profileForm">
          <div style="display:flex;align-items:center;gap:18px;margin-bottom:22px">
            <div class="profile-avatar-lg" id="avatarPreview" style="margin:0;width:72px;height:72px">
              ${user.avatar ? `<img src="${user.avatar}" alt="">` : avatarArt(user.id, user.name)}
            </div>
            <div>
              <label class="btn btn-outline btn-sm" for="avatarInput" style="cursor:pointer">${icon('upload', { size: 15 })} Change avatar</label>
              <input type="file" id="avatarInput" accept="image/*" style="display:none">
              <input type="hidden" name="avatar" id="avatarData" value="${user.avatar || ''}">
              <div class="hint">Optional. PNG or JPG, stored as part of your profile.</div>
            </div>
          </div>

          <div class="field">
            <label for="name">Display name</label>
            <input type="text" id="name" name="name" value="${user.name}" required>
          </div>
          <div class="field">
            <label for="bio">Bio</label>
            <textarea id="bio" name="bio" rows="3" maxlength="220">${user.bio || ''}</textarea>
          </div>
          <div class="field">
            <label>Categories of interest</label>
            <div class="pill-select">${catPills}</div>
          </div>
          <div class="field">
            <label>Display preferences</label>
            <div style="display:flex;gap:20px;flex-wrap:wrap;align-items:center">
              <label class="checkbox-row"><input type="radio" name="theme" value="light" ${user.theme !== 'dark' ? 'checked' : ''}> ${icon('sun', { size: 15 })} Light</label>
              <label class="checkbox-row"><input type="radio" name="theme" value="dark" ${user.theme === 'dark' ? 'checked' : ''}> ${icon('moon', { size: 15 })} Dark</label>
              <span style="width:1px;height:20px;background:var(--border)"></span>
              <label class="checkbox-row"><input type="radio" name="fontSize" value="sm" ${user.fontSize === 'sm' ? 'checked' : ''}> Small text</label>
              <label class="checkbox-row"><input type="radio" name="fontSize" value="md" ${(!user.fontSize || user.fontSize === 'md') ? 'checked' : ''}> Medium text</label>
              <label class="checkbox-row"><input type="radio" name="fontSize" value="lg" ${user.fontSize === 'lg' ? 'checked' : ''}> Large text</label>
            </div>
          </div>
          <button type="submit" class="btn btn-primary">${icon('check', { size: 16 })} Save changes</button>
        </form>

        <hr class="divider">
        <h3 style="font-size:1.02rem">Change password</h3>
        <form method="POST" action="/profile/password">
          <div class="field"><label for="currentPassword">Current password</label><input type="password" id="currentPassword" name="currentPassword" required></div>
          <div class="field"><label for="newPassword">New password</label><input type="password" id="newPassword" name="newPassword" minlength="6" required></div>
          <button type="submit" class="btn btn-outline">${icon('shield', { size: 15 })} Update password</button>
        </form>
      </div>
    </div>
  </section>`;

  return layout({ title: 'Profile settings', body, user, path, flash, trail: [{ href: '/', label: 'Home' }, { href: '/dashboard', label: 'Dashboard' }, { href: '/profile', label: 'Profile' }] });
};
