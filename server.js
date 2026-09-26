const path = require('path');
const { FemtoApp } = require('./core/femto');
const { attachUser } = require('./middleware/auth');

loadEnv();

const app = new FemtoApp({
  viewsDir: path.join(__dirname, 'views'),
  publicDir: path.join(__dirname, 'public'),
  sessionSecret: process.env.SESSION_SECRET || 'fanhubplus-dev-secret-change-me'
});

app.use(attachUser);

require('./routes/seo')(app);
require('./routes/pages')(app);
require('./routes/auth')(app);
require('./routes/dashboard')(app);
require('./routes/content')(app);
require('./routes/characters')(app);
require('./routes/articles')(app);
require('./routes/merch')(app);
require('./routes/events')(app);
require('./routes/api')(app);
require('./routes/media')(app);
require('./routes/admin')(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n  Fan Hub Plus is running:  http://localhost:${PORT}\n`);
});

function loadEnv() {
  try {
    const fs = require('fs');
    const candidates = [path.join(__dirname, '.env'), path.join(__dirname, 'env.txt')];
    const envPath = candidates.find((p) => fs.existsSync(p));
    if (!envPath) return;
    fs.readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const idx = trimmed.indexOf('=');
      if (idx === -1) return;
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (!(key in process.env)) process.env[key] = val;
    });
  } catch {
  }
}
