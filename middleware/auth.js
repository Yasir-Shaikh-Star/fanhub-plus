const { Users } = require('../models');

function attachUser(req, res, next) {
  if (req.session.userId) {
    const user = Users.findById(req.session.userId);
    if (user) {
      const { passwordHash, resetToken, resetTokenExpiry, ...safeUser } = user;
      req.user = safeUser;
    } else {
      req.session.userId = null;
    }
  }
  const flash = req.session.flash || null;
  req.session.flash = null;
  res.locals = { user: req.user || null, path: req.url.split('?')[0], flash };
  next();
}

function requireAuth(req, res, next) {
  if (!req.user) {
    req.session.flash = { type: 'error', text: 'Please log in to continue.' };
    req.session.redirectAfterLogin = req.url;
    return res.redirect('/login');
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).render('errors/403', { user: req.user });
  }
  next();
}

function redirectIfAuthed(req, res, next) {
  if (req.user) return res.redirect('/dashboard');
  next();
}

module.exports = { attachUser, requireAuth, requireAdmin, redirectIfAuthed };
