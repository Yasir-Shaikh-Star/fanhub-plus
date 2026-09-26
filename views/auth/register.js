const { layout, icon } = require('../../core/layout');

module.exports = function register({ user, path, flash, categories, form = {} }) {
  const catPills = categories
    .map((c) => `<label><input type="checkbox" name="favoriteCategories" value="${c.id}" ${(form.favoriteCategories || []).includes(c.id) ? 'checked' : ''}><span>${c.name}</span></label>`)
    .join('');

  const body = `
  <section class="section" style="max-width:520px;margin:0 auto">
    <div class="container" style="max-width:520px">
      <div class="form-card reveal">
        <div style="text-align:center;margin-bottom:22px">
          <span class="brand-mark icon-pulse" style="margin:0 auto 12px;width:48px;height:48px">${icon('sparkles', { size: 24 })}</span>
          <h1 style="font-size:1.5rem">Join Fan Hub Plus</h1>
          <p>Free account &mdash; bookmarks, a personal dashboard, and a voice in the community.</p>
        </div>
        <form method="POST" action="/register">
          <div class="field">
            <label for="name">Display name</label>
            <input type="text" id="name" name="name" value="${form.name || ''}" required autofocus>
          </div>
          <div class="field">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" value="${form.email || ''}" required>
          </div>
          <div class="field">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" minlength="6" required autocomplete="new-password">
            <div class="pw-meter" id="pwMeter" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
            <div class="hint" id="pwHint">At least 6 characters, with 1 number and 1 special character (e.g. ! @ # $).</div>
          </div>
          <div class="field">
            <label>Favorite fandoms <span class="hint">(optional, shapes your dashboard)</span></label>
            <div class="pill-select">${catPills}</div>
          </div>
          <button type="submit" class="btn btn-primary btn-block">${icon('sparkles', { size: 16 })} Create account</button>
        </form>
        <p style="text-align:center;margin-top:18px;font-size:.86rem">Already a member? <a href="/login" style="color:var(--primary);font-weight:600">Log in</a></p>
      </div>
    </div>
  </section>`;
  return layout({ title: 'Create account', body, user, path, flash });
};
