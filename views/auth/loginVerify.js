const { layout, icon } = require('../../core/layout');

module.exports = function loginVerify({ user, path, flash, mailSent, devCode }) {
  const body = `
  <section class="section" style="max-width:440px;margin:0 auto">
    <div class="container" style="max-width:440px">
      <div class="form-card reveal">
        <div style="text-align:center;margin-bottom:22px">
          <span class="brand-mark icon-pulse" style="margin:0 auto 12px;width:48px;height:48px">${icon('shield', { size: 22 })}</span>
          <h1 style="font-size:1.4rem">Check your email</h1>
          <p>${mailSent ? 'We emailed a 6-digit verification code to your address.' : 'Enter the 6-digit verification code to finish logging in.'}</p>
        </div>
        ${!mailSent && devCode ? `
        <div class="flash info" style="position:static;margin-bottom:18px">
          ${icon('info', { size: 17 })}
          <span>Demo mode: no email server is configured, so here's your code directly &mdash; <strong style="letter-spacing:3px">${devCode}</strong>.</span>
        </div>` : ''}
        <form method="POST" action="/login/verify">
          <div class="field">
            <label for="code">Verification code</label>
            <div class="input-icon-wrap">${icon('shield', { size: 16 })}<input type="text" id="code" name="code" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="one-time-code" required autofocus style="letter-spacing:6px;font-weight:700;text-align:center"></div>
            <div class="hint">Code expires in 10 minutes.</div>
          </div>
          <button type="submit" class="btn btn-primary btn-block">${icon('check', { size: 16 })} Verify &amp; log in</button>
        </form>
        <form method="POST" action="/login/verify/resend" style="margin-top:12px">
          <button type="submit" class="btn btn-outline btn-block btn-sm">${icon('send', { size: 14 })} Resend code</button>
        </form>
        <p style="text-align:center;margin-top:16px;font-size:.86rem"><a href="/login" style="color:var(--primary)">Back to login</a></p>
      </div>
    </div>
  </section>`;
  return layout({ title: 'Verify login', body, user, path, flash });
};
