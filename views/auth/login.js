const { layout, icon } = require('../../core/layout');

module.exports = function login({ user, path, flash, email = '' }) {
  const body = `
  <section class="section" style="max-width:440px;margin:0 auto">
    <div class="container" style="max-width:440px">
      <div class="form-card reveal">
        <div style="text-align:center;margin-bottom:22px">
          <span class="brand-mark icon-pulse" style="margin:0 auto 12px;width:48px;height:48px">${icon('usercircle', { size: 24 })}</span>
          <h1 style="font-size:1.5rem">Welcome back</h1>
          <p>Log in to pick up your bookmarks and dashboard.</p>
        </div>
        <form method="POST" action="/login">
          <div class="field">
            <label for="email">Email</label>
            <div class="input-icon-wrap">${icon('send', { size: 16 })}<input type="email" id="email" name="email" value="${email}" required autofocus></div>
          </div>
          <div class="field">
            <label for="password">Password</label>
            <div class="input-icon-wrap">${icon('shield', { size: 16 })}<input type="password" id="password" name="password" required></div>
            <div class="hint" style="text-align:right"><a href="/forgot-password" style="color:var(--primary)">Forgot password?</a></div>
          </div>
          <button type="submit" class="btn btn-primary btn-block">${icon('arrowRight', { size: 16 })} Log in</button>
        </form>
        <p style="text-align:center;margin-top:18px;font-size:.86rem">New here? <a href="/register" style="color:var(--primary);font-weight:600">Create a free account</a></p>
        <hr class="divider">
        <p style="text-align:center;font-size:.78rem;color:var(--text-faint)">Demo accounts &mdash; admin@fanhubplus.com / Admin@123 &middot; jordan@example.com / Fan@1234</p>
      </div>
    </div>
  </section>`;
  return layout({ title: 'Log in', body, user, path, flash });
};
