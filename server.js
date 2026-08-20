/* G-TEC private admin server. Set ADMIN_USERNAME and ADMIN_PASSWORD before starting. */
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const vm = require('vm');
const { URL } = require('url');

const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'storage');
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
const DB_FILE = path.join(DATA_DIR, 'content.json');
const PORT = Number(process.env.PORT || 3000);
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_USERNAME || !ADMIN_PASSWORD) throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD must be set. See .env.example.');

fs.mkdirSync(UPLOAD_DIR, { recursive: true });
const gtecCertificate = { id: 'gtec-certificate', title: 'G-TEC Certificate', provider: 'G-TEC Education Rajakumari', university: '', description: 'Provided with relevant G-TEC courses.', category: 'all', relatedCourses: [], image: '', visible: true, global: true, createdAt: '', updatedAt: '' };
const defaults = { admin: null, offers: [], announcements: [], courses: [], gallery: [], certificates: [gtecCertificate], settings: {}, homepage: {} };
function readDb() { try { const db = { ...defaults, ...JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) }; db.certificates = Array.isArray(db.certificates) ? db.certificates : []; if (!db.certificates.some(c => c.id === gtecCertificate.id)) db.certificates.unshift(gtecCertificate); return db; } catch { return { ...defaults }; } }
function writeDb(db) { const tmp = `${DB_FILE}.tmp`; fs.writeFileSync(tmp, JSON.stringify(db, null, 2)); fs.renameSync(tmp, DB_FILE); }
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) { return { salt, hash: crypto.scryptSync(password, salt, 64).toString('hex') }; }
function staticCourses() { try { const source = fs.readFileSync(path.join(ROOT, 'js', 'courses.js'), 'utf8').replace('const COURSES_DATA =', 'globalThis.COURSES_DATA ='), sandbox = {}; vm.runInNewContext(source, sandbox, { timeout: 1000 }); return Array.isArray(sandbox.COURSES_DATA) ? sandbox.COURSES_DATA.map(course => ({ id: course.id || id(), title: safeText(course.title, 160), category: safeText(course.category, 40), duration: safeText(course.duration, 60), description: safeText(course.overview || course.shortDesc), image: safeText(course.image, 500), classification: safeText(course.level, 30), fee: '', features: '', enquiryLink: '', visible: true, createdAt: now(), updatedAt: now() })) : []; } catch { return []; } }
function staticCertificates() { try { const source = fs.readFileSync(path.join(ROOT, 'js', 'certificates.js'), 'utf8').replace('const CERTIFICATES_DATA =', 'globalThis.CERTIFICATES_DATA ='), sandbox = {}; vm.runInNewContext(source, sandbox, { timeout: 1000 }); return Array.isArray(sandbox.CERTIFICATES_DATA) ? sandbox.CERTIFICATES_DATA.map(cert => ({ id: safeText(cert.id, 120), title: safeText(cert.name, 160), provider: safeText(cert.provider, 160), university: safeText(cert.university, 160), description: safeText(cert.description), category: safeText(cert.category, 40) || 'all', relatedCourses: Array.isArray(cert.relatedCourses) ? cert.relatedCourses.map(value => safeText(value, 160)).filter(Boolean).slice(0, 30) : [], image: safeText(cert.logo, 500), visible: true, global: false, createdAt: now(), updatedAt: now() })).filter(cert => cert.id && cert.title) : []; } catch { return []; } }
function backupDb() { const backupDir = path.join(DATA_DIR, 'backups'); fs.mkdirSync(backupDir, { recursive: true }); const stamp = now().replace(/[:.]/g, '-'); fs.copyFileSync(DB_FILE, path.join(backupDir, `content-${stamp}-certificate-migration.json`)); }
function ensureAdmin() { const newDatabase = !fs.existsSync(DB_FILE), db = readDb(); let changed = false; if (newDatabase && !db.courses.length) { db.courses = staticCourses(); changed = true; } const knownCertificates = new Set(db.certificates.map(cert => cert.id)); const missingCertificates = staticCertificates().filter(cert => !knownCertificates.has(cert.id)); if (missingCertificates.length) { if (!newDatabase) backupDb(); db.certificates.push(...missingCertificates); changed = true; } if (!db.admin) { db.admin = { username: ADMIN_USERNAME, ...hashPassword(ADMIN_PASSWORD) }; changed = true; } if (changed) writeDb(db); return db; }
const sessions = new Map(), attempts = new Map();
const id = () => crypto.randomUUID();
const now = () => new Date().toISOString();
const safeText = (v, limit = 1000) => String(v || '').trim().replace(/[<>]/g, '').slice(0, limit);
const safeUrl = value => { const text = safeText(value, 500); if (!text) return ''; try { const url = new URL(text); return /^https?:$/.test(url.protocol) ? url.href : ''; } catch { return ''; } };
ensureAdmin();
function saveImage(value, existing = '') { if (!value || value === existing) return existing; const m = String(value).match(/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/); if (!m) throw new Error('Only PNG, JPEG, and WebP image uploads are allowed.'); const bytes = Buffer.from(m[2], 'base64'); if (!bytes.length || bytes.length > 700000) throw new Error('Image must be 700 KB or smaller.'); const ext = m[1] === 'image/png' ? '.png' : m[1] === 'image/webp' ? '.webp' : '.jpg'; const name = `${id()}${ext}`; fs.writeFileSync(path.join(UPLOAD_DIR, name), bytes, { mode: 0o600 }); return `/uploads/${name}`; }
function countImageReferences(ref, db) {
  if (!ref || typeof ref !== 'string') return 0;
  let count = 0;
  if (db.homepage) {
    if (db.homepage.heroImage === ref) count++;
    if (db.homepage.heroBgImage === ref) count++;
  }
  const collections = ['offers', 'announcements', 'courses', 'gallery', 'certificates'];
  for (const c of collections) {
    if (Array.isArray(db[c])) {
      for (const item of db[c]) {
        if (item && item.image === ref) count++;
      }
    }
  }
  return count;
}
function removeImage(ref, db) {
  if (/^\/uploads\/[a-f0-9-]+\.(png|jpg|webp)$/.test(ref || '')) {
    const currentDb = db || readDb();
    if (countImageReferences(ref, currentDb) <= 1) {
      fs.rmSync(path.join(ROOT, ref), { force: true });
    }
  }
}
function cookies(req) { return Object.fromEntries((req.headers.cookie || '').split(';').map(x => x.trim().split('=').map(decodeURIComponent)).filter(x => x.length === 2)); }
function send(res, code, payload, headers = {}) { res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers }); res.end(JSON.stringify(payload)); }
function body(req) { return new Promise((resolve, reject) => { let data = ''; req.on('data', c => { data += c; if (data.length > 2_000_000) reject(new Error('Request too large')); }); req.on('end', () => { try { resolve(data ? JSON.parse(data) : {}); } catch { reject(new Error('Invalid JSON')); } }); }); }
function session(req) { const s = sessions.get(cookies(req).gtec_admin); return s && s.expires > Date.now() ? s : null; }
function requireAdmin(req, res) { const s = session(req); if (!s) { send(res, 401, { error: 'Authentication required' }); return null; } if (req.headers['x-csrf-token'] !== s.csrf) { send(res, 403, { error: 'Invalid request token' }); return null; } return s; }
function publicDb(db) { const stamp = Date.now(); const visibleOffer = o => o.enabled && (!o.startAt || Date.parse(o.startAt) <= stamp) && (!o.endAt || Date.parse(o.endAt) > stamp); return { offers: db.offers.filter(visibleOffer), announcements: db.announcements.filter(a => a.published), courses: db.courses.filter(c => c.visible), gallery: db.gallery.filter(g => g.visible), certificates: db.certificates.filter(c => c.visible), settings: db.settings, homepage: db.homepage }; }
function normalize(type, source) {
  const x = source || {};
  if (type === 'offers') return { title: safeText(x.title, 120), description: safeText(x.description), discount: safeText(x.discount, 80), offerPrice: safeText(x.offerPrice, 50), originalPrice: safeText(x.originalPrice, 50), startAt: safeText(x.startAt, 30), endAt: safeText(x.endAt, 30), buttonText: safeText(x.buttonText, 60), buttonLink: safeUrl(x.buttonLink), image: safeText(x.image, 500), enabled: !!x.enabled };
  if (type === 'announcements') return { title: safeText(x.title, 160), description: safeText(x.description), date: safeText(x.date, 30), image: safeText(x.image, 500), buttonText: safeText(x.buttonText, 60), buttonLink: safeUrl(x.buttonLink), published: !!x.published };
  if (type === 'courses') return { title: safeText(x.title, 160), category: safeText(x.category, 40), duration: safeText(x.duration, 60), description: safeText(x.description), image: safeText(x.image, 500), classification: safeText(x.classification, 30), fee: safeText(x.fee, 50), features: safeText(x.features, 1000), enquiryLink: safeUrl(x.enquiryLink), visible: !!x.visible };
  if (type === 'certificates') return { title: safeText(x.title, 160), provider: safeText(x.provider, 160), university: safeText(x.university, 160), description: safeText(x.description), category: safeText(x.category, 40), relatedCourses: Array.isArray(x.relatedCourses) ? x.relatedCourses.map(v => safeText(v, 160)).filter(Boolean).slice(0, 30) : safeText(x.relatedCourses, 1000).split('\n').map(v => safeText(v, 160)).filter(Boolean).slice(0, 30), image: safeText(x.image, 500), visible: !!x.visible, global: !!x.global };
  return { title: safeText(x.title, 160), description: safeText(x.description), category: safeText(x.category, 60), image: safeText(x.image, 500), visible: !!x.visible };
}
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
function staticFile(req, res, pathname) { if (/^\/uploads\/[a-f0-9-]+\.(png|jpg|webp)$/.test(pathname)) { const file = path.join(UPLOAD_DIR, path.basename(pathname)); return fs.readFile(file, (err, content) => { if (err) return send(res, 404, { error: 'Not found' }); res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff', 'Cache-Control':'public, max-age=31536000, immutable' }); res.end(content); }); } const requested = pathname === '/' ? '/index.html' : pathname; const file = path.resolve(ROOT, `.${requested}`); if (!file.startsWith(ROOT) || file.includes(`${path.sep}storage${path.sep}`) || file.endsWith('.env')) return send(res, 404, { error: 'Not found' }); fs.readFile(file, (err, content) => { if (err) return send(res, 404, { error: 'Not found' }); res.writeHead(200, { 'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' }); res.end(content); }); }
http.createServer(async (req, res) => {
  const u = new URL(req.url, `http://${req.headers.host}`), p = u.pathname;
  try {
    if (req.method === 'GET' && p === '/api/public') return send(res, 200, publicDb(readDb()), { 'Cache-Control': 'no-store, no-cache, must-revalidate' });
    if (req.method === 'POST' && p === '/api/auth/login') {
      const ip = req.socket.remoteAddress;
      let record = attempts.get(ip) || { count: 0, stage: 0, reset: 0 };
      if (record.reset > Date.now()) {
        return send(res, 429, { error: 'Too many failed login attempts. Please try again later.' });
      }
      if (record.count >= 5 && record.reset <= Date.now()) {
        record.count = 0;
      }

      const b = await body(req), db = readDb();
      const validUsername = safeText(b.username, 120) === db.admin.username;
      const validPassword = crypto.timingSafeEqual(
        Buffer.from(hashPassword(String(b.password || ''), db.admin.salt).hash, 'hex'),
        Buffer.from(db.admin.hash, 'hex')
      );

      if (!validUsername || !validPassword) {
        record.count++;
        if (record.count >= 5) {
          record.stage = (record.stage || 0) + 1;
          const duration = record.stage === 1 ? 600000 : record.stage === 2 ? 1200000 : record.stage === 3 ? 2400000 : 3600000;
          record.reset = Date.now() + duration;
          attempts.set(ip, record);
          return send(res, 429, { error: 'Too many failed login attempts. Please try again later.' });
        }
        attempts.set(ip, record);
        return send(res, 401, { error: 'Invalid username or password' });
      }

      attempts.delete(ip);
      const token = crypto.randomBytes(32).toString('hex'), csrf = crypto.randomBytes(24).toString('hex');
      sessions.set(token, { csrf, expires: Date.now() + 8 * 3600_000 });
      return send(res, 200, { csrf }, { 'Set-Cookie': `gtec_admin=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${process.env.NODE_ENV === 'production' ? '; Secure' : ''}` });
    }
    if (req.method === 'POST' && p === '/api/auth/logout') { const s = requireAdmin(req, res); if (!s) return; sessions.delete(cookies(req).gtec_admin); return send(res, 200, { ok: true }, { 'Set-Cookie': 'gtec_admin=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0' }); }
    if (req.method === 'GET' && p === '/api/auth/me') { const s = session(req), db = readDb(); return s ? send(res, 200, { authenticated: true, csrf: s.csrf, username: db.admin ? db.admin.username : 'admin' }) : send(res, 401, { authenticated: false }); }
    if (p === '/api/admin/data') { if (!requireAdmin(req, res)) return; const { admin, ...content } = readDb(); return send(res, 200, { ...content, currentUsername: admin ? admin.username : 'admin' }); }
    if (p === '/api/admin/account' && req.method === 'PUT') {
      if (!requireAdmin(req, res)) return;
      const ip = req.socket.remoteAddress;
      let record = attempts.get(`acc_${ip}`) || { count: 0, reset: 0 };
      if (record.reset > Date.now()) {
        return send(res, 429, { error: 'Too many failed verification attempts. Please try again later.' });
      }
      if (record.count >= 5 && record.reset <= Date.now()) {
        record.count = 0;
      }

      const b = await body(req), db = readDb();
      const currentUsername = safeText(b.currentUsername, 120);
      const currentPassword = String(b.currentPassword || '');

      if (!currentUsername || !currentPassword) {
        return send(res, 401, { error: 'Current credentials are incorrect.' });
      }

      const validUsername = currentUsername === db.admin.username;
      const validPassword = crypto.timingSafeEqual(
        Buffer.from(hashPassword(currentPassword, db.admin.salt).hash, 'hex'),
        Buffer.from(db.admin.hash, 'hex')
      );

      if (!validUsername || !validPassword) {
        record.count++;
        if (record.count >= 5) {
          record.reset = Date.now() + 600000;
        }
        attempts.set(`acc_${ip}`, record);
        return send(res, 401, { error: 'Current credentials are incorrect.' });
      }
      attempts.delete(`acc_${ip}`);

      const hasNewUsername = b.newUsername !== undefined && b.newUsername !== null && String(b.newUsername).trim().length > 0;
      const hasNewPassword = b.newPassword !== undefined && b.newPassword !== null && String(b.newPassword).length > 0;

      if (!hasNewUsername && !hasNewPassword) {
        return send(res, 400, { error: 'Please enter a new username or new password to update.' });
      }

      let nextUsername = db.admin.username;
      let nextSalt = db.admin.salt;
      let nextHash = db.admin.hash;

      if (hasNewUsername) {
        const newUsername = safeText(b.newUsername, 120);
        if (!newUsername || newUsername.length < 3) return send(res, 400, { error: 'New username must be at least 3 characters long.' });
        if (!/^[a-zA-Z0-9_.-]+$/.test(newUsername)) return send(res, 400, { error: 'Username contains invalid characters.' });
        nextUsername = newUsername;
      }

      if (hasNewPassword) {
        const newPassword = String(b.newPassword), confirmPassword = String(b.confirmPassword || '');
        if (newPassword !== confirmPassword) return send(res, 400, { error: 'New passwords do not match.' });
        if (newPassword.length < 12) return send(res, 400, { error: 'Password must be at least 12 characters long.' });
        if (!/[A-Z]/.test(newPassword)) return send(res, 400, { error: 'Password must contain at least one uppercase letter (A-Z).' });
        if (!/[a-z]/.test(newPassword)) return send(res, 400, { error: 'Password must contain at least one lowercase letter (a-z).' });
        if (!/[0-9]/.test(newPassword)) return send(res, 400, { error: 'Password must contain at least one number (0-9).' });
        if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(newPassword)) return send(res, 400, { error: 'Password must contain at least one special character.' });

        const hp = hashPassword(newPassword);
        nextSalt = hp.salt;
        nextHash = hp.hash;
      }

      db.admin.username = nextUsername;
      db.admin.salt = nextSalt;
      db.admin.hash = nextHash;

      backupDb();
      writeDb(db);
      sessions.clear();

      return send(res, 200, { ok: true, message: 'Account credentials updated successfully. Please log in again.' }, { 'Set-Cookie': 'gtec_admin=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0' });
    }
    const match = p.match(/^\/api\/admin\/(offers|announcements|courses|gallery|certificates)(?:\/([a-zA-Z0-9-]+))?$/);
    if (match) { if (!requireAdmin(req, res)) return; const [, type, itemId] = match, db = readDb(), collection = db[type]; if (req.method === 'POST' && !itemId) { const input = await body(req); input.image = saveImage(input.image); const item = { id: id(), ...normalize(type, input), createdAt: now(), updatedAt: now() }; if (!item.title) return send(res, 400, { error: 'Title is required' }); collection.unshift(item); writeDb(db); return send(res, 201, item); } if (req.method === 'PUT' && itemId) { const i = collection.findIndex(x => x.id === itemId); if (i < 0) return send(res, 404, { error: 'Not found' }); const input = await body(req); input.image = saveImage(input.image, collection[i].image); collection[i] = { ...collection[i], ...normalize(type, input), updatedAt: now() }; writeDb(db); return send(res, 200, collection[i]); } if (req.method === 'DELETE' && itemId) { const i = collection.findIndex(x => x.id === itemId); if (i < 0) return send(res, 404, { error: 'Not found' }); removeImage(collection[i].image, db); collection.splice(i, 1); writeDb(db); return send(res, 200, { ok: true }); } }
    if (p === '/api/admin/settings' && req.method === 'PUT') { if (!requireAdmin(req, res)) return; const b = await body(req), db = readDb(), keys = ['siteName', 'phone', 'whatsapp', 'address', 'email', 'hours', 'maps', 'mapsEmbed', 'instagram', 'facebook', 'form'], urls = new Set(['maps', 'mapsEmbed', 'instagram', 'facebook', 'form']); db.settings = { ...db.settings, ...Object.fromEntries(keys.filter(k => Object.prototype.hasOwnProperty.call(b, k)).map(k => [k, urls.has(k) ? safeUrl(b[k]) : safeText(b[k], 500)])) }; writeDb(db); return send(res, 200, db.settings); }
    if (p === '/api/admin/homepage' && req.method === 'PUT') { if (!requireAdmin(req, res)) return; const b = await body(req), db = readDb(); b.heroImage = saveImage(b.heroImage, db.homepage.heroImage || ''); b.heroBgImage = saveImage(b.heroBgImage, db.homepage.heroBgImage || ''); db.homepage = { ...db.homepage, ...Object.fromEntries(['heroHeading','heroDescription','ctaText','ctaLink','offerBanner','announcementBanner','heroImage','heroBgImage'].filter(k => Object.prototype.hasOwnProperty.call(b, k)).map(k => [k, k === 'ctaLink' ? safeUrl(b[k]) : safeText(b[k], 1000)])) }; writeDb(db); return send(res, 200, db.homepage); }
    if ((p === '/admin-dashboard.html' || p === '/admin/dashboard.html') && !session(req)) return res.writeHead(302, { Location: '/admin-login.html', 'Cache-Control': 'no-store' }).end();
    staticFile(req, res, p);
  } catch (e) { send(res, 400, { error: e.message === 'Request too large' ? e.message : 'Invalid request' }); }
}).listen(PORT, () => console.log(`G-TEC site: http://localhost:${PORT}`));
