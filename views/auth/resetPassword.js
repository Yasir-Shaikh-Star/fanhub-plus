const { layout, icon } = require('../../core/layout');

module.exports = function resetPassword({ user, path, flash, token, valid }) {
  const body = `
  <section class="section" style="max-width:440px;margin:0 auto">
    <div class="container" style="max-width:440px">
      <div class="form-card reveal">
        <div style="text-align:center;margin-bottom:22px">
          <span class="brand-mark" style="margin:0 auto 12px;width:48px;height:48px">${icon('shield', { size: 22 })}</span>
          <h1 style="font-size:1.4rem">Choose a new password</h1>
        </div>
        ${valid ? `
        <form method="POST" action="/reset-password/${token}">
          <div class="field">
            <label for="password">New password</label>
            <input type="password" id="password" name="password" minlength="6" required autofocus autocomplete="new-password">
            <div class="pw-meter" id="pwMeter" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
            <div class="hint" id="pwHint">At least 6 characters, with 1 number and 1 special character (e.g. ! @ # $).</div>
          </div>
          <div class="field">
            <label for="confirm">Confirm password</label>
            <input type="password" id="confirm" name="confirm" minlength="6" required>
          </div>
          <button type="submit" class="btn btn-primary btn-block">${icon('check', { size: 16 })} Update password</button>
        </form>` : `
        <div class="empty-state">${icon('x', { size: 34 })}<p>This reset link is invalid or has expired.</p><a href="/forgot-password" class="btn btn-outline btn-sm">Request a new link</a></div>`}
      </div>
    </div>
  </section>`;
  return layout({ title: 'Reset password', body, user, path, flash });
};
