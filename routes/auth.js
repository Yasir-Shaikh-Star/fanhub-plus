const { Users, Categories } = require('../models');
const { hashPassword, verifyPassword, makeToken, generateCode, checkPasswordPolicy } = require('../core/security');
const { redirectIfAuthed, requireAuth } = require('../middleware/auth');
const { sendEmail } = require('../core/mailer');
const requestContext = require('../core/requestContext');

const RESET_TTL_MS = 30 * 60 * 1000;
const CODE_TTL_MS = 10 * 60 * 1000;

function currentOrigin() {
  const ctx = requestContext.current();
  return ctx ? `${ctx.protocol}://${ctx.host}` : '';
}

module.exports = function registerAuthRoutes(app) {
  app.get('/register', redirectIfAuthed, (req, res) => {
    res.render('auth/register', { categories: Categories.all(), form: {} });
  });

  app.post('/register', redirectIfAuthed, async (req, res) => {
    const { name, email, password } = req.body;
    const favoriteCategories = [].concat(req.body.favoriteCategories || []).filter(Boolean);

    const policy = checkPasswordPolicy(password);
    if (!name || !email || !password || !policy.valid) {
      const missing = !name || !email || !password ? 'Please fill every field.' : `Password needs ${policy.problems.join(', ')}.`;
      req.session.flash = { type: 'error', text: missing };
      return res.render('auth/register', { categories: Categories.all(), form: { name, email, favoriteCategories } });
    }
    if (Users.findOne((u) => u.email.toLowerCase() === email.toLowerCase())) {
      req.session.flash = { type: 'error', text: 'An account with that email already exists.' };
      return res.render('auth/register', { categories: Categories.all(), form: { name, email, favoriteCategories } });
    }

    const user = Users.insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: hashPassword(password),
      role: 'registered',
      bio: '',
      avatar: null,
      favoriteCategories,
      theme: 'light',
      fontSize: 'md',
      createdAt: new Date().toISOString(),
      resetToken: null,
      resetTokenExpiry: null
    });

    const code = generateCode();
    Users.update(user.id, { loginCode: code, loginCodeExpiry: Date.now() + CODE_TTL_MS });
    req.session.pendingLoginUserId = user.id;

    const mail = await sendEmail({
      to: user.email,
      subject: 'Welcome to Fan Hub Plus - verify your email',
      html: `<p>Hi ${user.name.split(' ')[0]},</p><p>Welcome to Fan Hub Plus! Your verification code is:</p>` +
        `<p style="font-size:28px;font-weight:700;letter-spacing:4px">${code}</p>` +
        `<p>This code expires in 10 minutes.</p>`,
      text: `Welcome to Fan Hub Plus! Your verification code is ${code}. It expires in 10 minutes.`
    });
    req.session.pendingLoginMailSent = mail.ok;
    req.session.pendingLoginDevCode = mail.ok ? null : code;

    res.redirect('/login/verify');
  });

  app.get('/login', redirectIfAuthed, (req, res) => {
    res.render('auth/login', { email: '' });
  });

  app.post('/login', redirectIfAuthed, async (req, res) => {
    const { email, password } = req.body;
    const user = Users.findOne((u) => u.email.toLowerCase() === (email || '').toLowerCase());

    if (!user || !verifyPassword(password || '', user.passwordHash)) {
      req.session.flash = { type: 'error', text: 'That email and password don’t match our records.' };
      return res.render('auth/login', { email: email || '' });
    }

    const code = generateCode();
    Users.update(user.id, { loginCode: code, loginCodeExpiry: Date.now() + CODE_TTL_MS });
    req.session.pendingLoginUserId = user.id;

    const mail = await sendEmail({
      to: user.email,
      subject: 'Your Fan Hub Plus login code',
      html: `<p>Hi ${user.name.split(' ')[0]},</p><p>Your login verification code is:</p>` +
        `<p style="font-size:28px;font-weight:700;letter-spacing:4px">${code}</p>` +
        `<p>This code expires in 10 minutes. If you didn't try to log in, you can safely ignore this email.</p>`,
      text: `Your Fan Hub Plus login code is ${code}. It expires in 10 minutes.`
    });
    req.session.pendingLoginMailSent = mail.ok;
    req.session.pendingLoginDevCode = mail.ok ? null : code;

    res.redirect('/login/verify');
  });

  app.get('/login/verify', redirectIfAuthed, (req, res) => {
    if (!req.session.pendingLoginUserId) return res.redirect('/login');
    res.render('auth/loginVerify', {
      mailSent: Boolean(req.session.pendingLoginMailSent),
      devCode: req.session.pendingLoginDevCode || null
    });
  });

  app.post('/login/verify', redirectIfAuthed, (req, res) => {
    const pendingId = req.session.pendingLoginUserId;
    if (!pendingId) return res.redirect('/login');
    const user = Users.findById(pendingId);
    const submitted = (req.body.code || '').trim();
    const valid = user && user.loginCode && user.loginCode === submitted && user.loginCodeExpiry > Date.now();

    if (!valid) {
      req.session.flash = { type: 'error', text: 'That code is incorrect or has expired.' };
      return res.render('auth/loginVerify', {
        mailSent: Boolean(req.session.pendingLoginMailSent),
        devCode: req.session.pendingLoginDevCode || null
      });
    }

    Users.update(user.id, { loginCode: null, loginCodeExpiry: null });
    req.session.pendingLoginUserId = null;
    req.session.pendingLoginMailSent = null;
    req.session.pendingLoginDevCode = null;
    req.session.userId = user.id;
    const dest = req.session.redirectAfterLogin || '/dashboard';
    req.session.redirectAfterLogin = null;
    req.session.flash = { type: 'success', text: `Good to see you, ${user.name.split(' ')[0]}.` };
    res.redirect(dest);
  });

  app.post('/login/verify/resend', redirectIfAuthed, async (req, res) => {
    const pendingId = req.session.pendingLoginUserId;
    if (!pendingId) return res.redirect('/login');
    const user = Users.findById(pendingId);
    if (!user) return res.redirect('/login');

    const code = generateCode();
    Users.update(user.id, { loginCode: code, loginCodeExpiry: Date.now() + CODE_TTL_MS });
    const mail = await sendEmail({
      to: user.email,
      subject: 'Your Fan Hub Plus login code',
      html: `<p>Your new login verification code is:</p>` +
        `<p style="font-size:28px;font-weight:700;letter-spacing:4px">${code}</p>` +
        `<p>This code expires in 10 minutes.</p>`,
      text: `Your Fan Hub Plus login code is ${code}. It expires in 10 minutes.`
    });
    req.session.pendingLoginMailSent = mail.ok;
    req.session.pendingLoginDevCode = mail.ok ? null : code;
    req.session.flash = { type: 'success', text: mail.ok ? 'A new code has been emailed to you.' : 'A new code was generated.' };
    res.redirect('/login/verify');
  });

  app.post('/logout', (req, res) => {
    req.session.userId = null;
    res.redirect('/');
  });

  app.get('/forgot-password', redirectIfAuthed, (req, res) => {
    res.render('auth/forgotPassword', { resetLink: null, mailSent: false });
  });

  app.post('/forgot-password', redirectIfAuthed, async (req, res) => {
    const user = Users.findOne((u) => u.email.toLowerCase() === (req.body.email || '').toLowerCase());
    if (!user) {
      req.session.flash = { type: 'error', text: 'No account found with that email.' };
      return res.render('auth/forgotPassword', { resetLink: null, mailSent: false });
    }
    const token = makeToken();
    Users.update(user.id, { resetToken: token, resetTokenExpiry: Date.now() + RESET_TTL_MS });
    const resetPath = `/reset-password/${token}`;
    const resetUrl = `${currentOrigin()}${resetPath}`;

    const mail = await sendEmail({
      to: user.email,
      subject: 'Reset your Fan Hub Plus password',
      html: `<p>Hi ${user.name.split(' ')[0]},</p>` +
        `<p>Click the link below to reset your password. It expires in 30 minutes.</p>` +
        `<p><a href="${resetUrl}">${resetUrl}</a></p>` +
        `<p>If you didn't request this, you can safely ignore this email.</p>`,
      text: `Reset your Fan Hub Plus password: ${resetUrl} (expires in 30 minutes)`
    });

    if (mail.ok) {
      return res.render('auth/forgotPassword', { resetLink: null, mailSent: true });
    }
    res.render('auth/forgotPassword', { resetLink: resetPath, mailSent: false });
  });

  app.get('/reset-password/:token', redirectIfAuthed, (req, res) => {
    const user = Users.findOne((u) => u.resetToken === req.params.token);
    const valid = user && user.resetTokenExpiry > Date.now();
    res.render('auth/resetPassword', { token: req.params.token, valid: Boolean(valid) });
  });

  app.post('/reset-password/:token', redirectIfAuthed, (req, res) => {
    const user = Users.findOne((u) => u.resetToken === req.params.token);
    const valid = user && user.resetTokenExpiry > Date.now();
    if (!valid) {
      return res.render('auth/resetPassword', { token: req.params.token, valid: false });
    }
    const resetPolicy = checkPasswordPolicy(req.body.password);
    if (!req.body.password || req.body.password !== req.body.confirm || !resetPolicy.valid) {
      const text = req.body.password && req.body.password !== req.body.confirm
        ? 'Passwords must match.'
        : `Password needs ${resetPolicy.problems.join(', ')}.`;
      req.session.flash = { type: 'error', text };
      return res.render('auth/resetPassword', { token: req.params.token, valid: true });
    }
    Users.update(user.id, { passwordHash: hashPassword(req.body.password), resetToken: null, resetTokenExpiry: null });
    req.session.flash = { type: 'success', text: 'Password updated. You can log in now.' };
    res.redirect('/login');
  });

  app.get('/profile', requireAuth, (req, res) => {
    res.render('dashboard/profile', { categories: Categories.all() });
  });

  app.post('/profile', requireAuth, (req, res) => {
    const favoriteCategories = [].concat(req.body.favoriteCategories || []).filter(Boolean);
    Users.update(req.user.id, {
      name: req.body.name || req.user.name,
      bio: (req.body.bio || '').slice(0, 220),
      favoriteCategories,
      theme: req.body.theme === 'dark' ? 'dark' : 'light',
      fontSize: ['sm', 'md', 'lg'].includes(req.body.fontSize) ? req.body.fontSize : 'md',
      avatar: req.body.avatar || req.user.avatar || null
    });
    req.session.flash = { type: 'success', text: 'Profile updated.' };
    res.redirect('/profile');
  });

  app.post('/profile/password', requireAuth, (req, res) => {
    const full = Users.findById(req.user.id);
    if (!verifyPassword(req.body.currentPassword || '', full.passwordHash)) {
      req.session.flash = { type: 'error', text: 'Current password is incorrect.' };
      return res.redirect('/profile');
    }
    const newPolicy = checkPasswordPolicy(req.body.newPassword);
    if (!req.body.newPassword || !newPolicy.valid) {
      req.session.flash = { type: 'error', text: `New password needs ${newPolicy.problems.join(', ')}.` };
      return res.redirect('/profile');
    }
    Users.update(req.user.id, { passwordHash: hashPassword(req.body.newPassword) });
    req.session.flash = { type: 'success', text: 'Password changed.' };
    res.redirect('/profile');
  });

  app.post('/api/preferences', requireAuth, (req, res) => {
    const patch = {};
    if (req.body.theme) patch.theme = req.body.theme === 'dark' ? 'dark' : 'light';
    if (req.body.fontSize) patch.fontSize = ['sm', 'md', 'lg'].includes(req.body.fontSize) ? req.body.fontSize : 'md';
    Users.update(req.user.id, patch);
    res.json({ ok: true });
  });
};
