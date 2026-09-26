
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');
const requestContext = require('./requestContext');

const SESSION_COOKIE = 'fh_sid';
const SESSION_TTL_MS = 1000 * 60 * 60 * 6;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg'
};

function parseCookies(header) {
  const jar = {};
  if (!header) return jar;
  header.split(';').forEach((piece) => {
    const idx = piece.indexOf('=');
    if (idx === -1) return;
    const key = piece.slice(0, idx).trim();
    const val = piece.slice(idx + 1).trim();
    if (key) jar[key] = decodeURIComponent(val);
  });
  return jar;
}

class Router {
  constructor() {
    this.stack = [];
  }

  add(method, urlPattern, handlers) {
    const keys = [];
    const regexStr = urlPattern
      .replace(/\/+$/, '')
      .split('/')
      .map((segment) => {
        if (segment.startsWith(':')) {
          keys.push(segment.slice(1));
          return '([^/]+)';
        }
        return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      })
      .join('/');
    const regex = new RegExp('^' + (regexStr || '') + '/?$');
    this.stack.push({ method, regex, keys, handlers: Array.isArray(handlers) ? handlers : [handlers] });
  }

  match(method, pathname) {
    for (const route of this.stack) {
      if (route.method !== method) continue;
      const m = route.regex.exec(pathname);
      if (!m) continue;
      const params = {};
      route.keys.forEach((key, i) => {
        params[key] = decodeURIComponent(m[i + 1]);
      });
      return { params, handlers: route.handlers };
    }
    return null;
  }
}

class FemtoApp {
  constructor(opts = {}) {
    this.router = new Router();
    this.middlewares = [];
    this.viewsDir = path.resolve(opts.viewsDir || path.join(process.cwd(), 'views'));
    this.publicDir = path.resolve(opts.publicDir || path.join(process.cwd(), 'public'));
    this.sessions = new Map();
    this.sessionSecret = opts.sessionSecret || 'fanhubplus-dev-secret';
    this.locals = {};

    setInterval(() => this._sweepSessions(), 1000 * 60 * 10).unref();
  }

  use(fn) {
    this.middlewares.push(fn);
  }

  get(p, ...h) { this.router.add('GET', p, h); }
  post(p, ...h) { this.router.add('POST', p, h); }
  put(p, ...h) { this.router.add('PUT', p, h); }
  delete(p, ...h) { this.router.add('DELETE', p, h); }

  _sweepSessions() {
    const now = Date.now();
    for (const [id, s] of this.sessions) {
      if (s.expires < now) this.sessions.delete(id);
    }
  }

  _sign(value) {
    const h = crypto.createHmac('sha256', this.sessionSecret).update(value).digest('hex');
    return `${value}.${h}`;
  }

  _unsign(signed) {
    if (!signed) return null;
    const idx = signed.lastIndexOf('.');
    if (idx === -1) return null;
    const value = signed.slice(0, idx);
    const expected = this._sign(value);
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signed))
      ? value
      : null;
  }

  _getOrCreateSession(cookies) {
    const raw = cookies[SESSION_COOKIE];
    const sid = raw ? this._unsign(raw) : null;
    if (sid && this.sessions.has(sid)) {
      const s = this.sessions.get(sid);
      s.expires = Date.now() + SESSION_TTL_MS;
      return { id: sid, data: s.data, isNew: false };
    }
    const newId = crypto.randomBytes(18).toString('hex');
    this.sessions.set(newId, { data: {}, expires: Date.now() + SESSION_TTL_MS });
    return { id: newId, data: this.sessions.get(newId).data, isNew: true };
  }

  async _readBody(req) {
    const contentType = req.headers['content-type'] || '';
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString('utf8');
    if (!raw) return {};
    if (contentType.includes('application/json')) {
      try { return JSON.parse(raw); } catch { return {}; }
    }
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const out = {};
      new URLSearchParams(raw).forEach((v, k) => { out[k] = v; });
      return out;
    }
    return { _raw: raw };
  }

  _serveStatic(pathname, res) {
    const safePath = path.normalize(pathname).replace(/^([.]{2}[/\\])+/, '');
    const filePath = path.join(this.publicDir, safePath);
    if (!filePath.startsWith(this.publicDir)) return false;
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) return false;
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'public, max-age=3600' });
    fs.createReadStream(filePath).pipe(res);
    return true;
  }

  render(res, viewName, data = {}) {
    const viewPath = path.join(this.viewsDir, viewName + '.js');
    delete require.cache[require.resolve(viewPath)];
    const view = require(viewPath);
    const html = view({ ...this.locals, ...data });
    res.writeHead(res.statusCode || 200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  }

  listen(port, cb) {
    const server = http.createServer(async (req, res) => {
      const protocol = (req.headers['x-forwarded-proto'] || 'http').split(',')[0].trim();
      const host = req.headers['x-forwarded-host'] || req.headers.host || `localhost:${port}`;
      await requestContext.run({ protocol, host, url: req.url }, async () => {
        try {
          await this._handle(req, res);
        } catch (err) {
          console.error('Unhandled error:', err);
          if (!res.headersSent) {
            res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
          }
          res.end('<h1>500 - Something broke on our end.</h1>');
        }
      });
    });
    server.listen(port, cb);
    return server;
  }

  async _handle(req, res) {
    const parsed = new URL(req.url, 'http://localhost');
    const pathname = decodeURIComponent(parsed.pathname);

    if (req.method === 'GET' && this._serveStatic(pathname, res)) return;

    const cookies = parseCookies(req.headers.cookie);
    const session = this._getOrCreateSession(cookies);

    req.query = Object.fromEntries(parsed.searchParams.entries());
    req.cookies = cookies;
    req.session = session.data;
    req.body = ['POST', 'PUT', 'DELETE'].includes(req.method) ? await this._readBody(req) : {};

    res.setCookie = () => {
      res.setHeader('Set-Cookie', `${SESSION_COOKIE}=${this._sign(session.id)}; HttpOnly; Path=/; Max-Age=${SESSION_TTL_MS / 1000}; SameSite=Lax`);
    };
    res.setCookie();

    res.redirect = (url) => {
      res.writeHead(302, { Location: url });
      res.end();
    };
    res.json = (obj) => {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(obj));
    };
    res.send = (body) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(body);
    };
    res.status = (code) => { res.statusCode = code; return res; };
    res.render = (viewName, data) => this.render(res, viewName, { ...(res.locals || {}), ...data });

    const match = this.router.match(req.method, pathname);

    const chain = [...this.middlewares, ...(match ? match.handlers : [])];
    req.params = match ? match.params : {};

    let i = 0;
    const next = async (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('<h1>500 - Something broke on our end.</h1>');
        return;
      }
      const fn = chain[i++];
      if (!fn) {
        if (!match) {
          res.status(404).render('errors/404', { user: req.session.user, path: pathname });
        }
        return;
      }
      try {
        await fn(req, res, next);
      } catch (e) {
        next(e);
      }
    };
    await next();
  }
}

module.exports = { FemtoApp };
