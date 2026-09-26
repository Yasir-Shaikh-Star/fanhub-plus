const { layout, icon } = require('../../core/layout');

module.exports = function forgotPassword({ user, path, flash, resetLink, mailSent }) {
  const body = `
  <section class="section" style="max-width:460px;margin:0 auto">
    <div class="container" style="max-width:460px">
      <div class="form-card reveal">
        <div style="text-align:center;margin-bottom:22px">
          <span class="brand-mark" style="margin:0 auto 12px;width:48px;height:48px">${icon('shield', { size: 22 })}</span>
          <h1 style="font-size:1.4rem">Reset your password</h1>
          <p>Enter your account email and we'll email you a secure, tokenized reset link.</p>
        </div>
        ${mailSent ? `
          <div class="flash success" style="position:static;margin-bottom:18px">
            ${icon('check', { size: 17 })}
            <span>Check your inbox &mdash; we've emailed a password reset link to that address. It expires in 30 minutes.</span>
          </div>` : resetLink ? `
          <div class="flash info" style="position:static;margin-bottom:18px">
            ${icon('info', { size: 17 })}
            <span>Demo mode: no email server is configured, so here's your reset link directly &mdash;
            <a href="${resetLink}" style="color:var(--primary);font-weight:700;word-break:break-all">${resetLink}</a>. It expires in 30 minutes.</span>
          </div>` : ''}
        <form method="POST" action="/forgot-password">
          <div class="field">
            <label for="email">Account email</label>
            <input type="email" id="email" name="email" required autofocus>
          </div>
          <button type="submit" class="btn btn-primary btn-block">${icon('send', { size: 16 })} Send reset link</button>
        </form>
        <p style="text-align:center;margin-top:16px;font-size:.86rem"><a href="/login" style="color:var(--primary)">Back to login</a></p>
      </div>
    </div>
  </section>`;
  return layout({ title: 'Reset password', body, user, path, flash });
};
