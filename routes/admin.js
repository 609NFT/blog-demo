const express = require('express');
const crypto = require('crypto');
const path = require('path');
const posts = require('../lib/posts');
const { render } = require('../lib/markdown');

const router = express.Router();

// Constant-time password check. Hashing both sides to a fixed length first lets
// timingSafeEqual run over equal-length buffers and hides length too.
function passwordMatches(candidate, expected) {
  const a = crypto.createHash('sha256').update(String(candidate)).digest();
  const b = crypto.createHash('sha256').update(String(expected)).digest();
  return crypto.timingSafeEqual(a, b);
}

// Gate the admin API on ADMIN_PASSWORD (set it via VibeKit /env). Until it's set,
// the whole admin surface is disabled — no default password ever ships. The UI
// sends `Authorization: Basic base64("admin:<password>")` on every call; we use
// fetch so no native browser prompt appears.
function requirePassword(req, res, next) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return res.status(503).json({ error: 'admin_disabled', message: 'Set ADMIN_PASSWORD in your env vars to enable the admin.' });
  }
  const auth = req.headers.authorization || '';
  const m = auth.match(/^Basic\s+(.+)$/i);
  if (!m) return res.status(401).json({ error: 'unauthorized' });
  const decoded = Buffer.from(m[1], 'base64').toString('utf8');
  const password = decoded.slice(decoded.indexOf(':') + 1);
  if (!password || !passwordMatches(password, expected)) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  next();
}

// Admin shell (login + editor UI). Not itself sensitive — it holds no data and
// every API call it makes is gated by requirePassword.
router.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin.html'));
});

// Cheap endpoint the login form hits to validate the password.
router.get('/api/admin/verify', requirePassword, (req, res) => res.json({ ok: true }));

// Full posts (with bodies) for editing, newest first.
router.get('/api/admin/posts', requirePassword, (req, res) => {
  res.json({ posts: posts.all() });
});

router.post('/api/admin/posts', requirePassword, (req, res) => {
  try {
    const post = posts.create(req.body || {});
    res.status(201).json({ post });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put('/api/admin/posts/:slug', requirePassword, (req, res) => {
  try {
    const post = posts.update(req.params.slug, req.body || {});
    if (!post) return res.status(404).json({ error: 'not_found' });
    res.json({ post });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete('/api/admin/posts/:slug', requirePassword, (req, res) => {
  const ok = posts.remove(req.params.slug);
  if (!ok) return res.status(404).json({ error: 'not_found' });
  res.json({ ok: true });
});

// Live markdown preview for the editor.
router.post('/api/admin/preview', requirePassword, (req, res) => {
  const { html } = render((req.body && req.body.body) || '');
  res.json({ html });
});

module.exports = router;
