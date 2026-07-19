const express = require('express');
const path = require('path');
const posts = require('../lib/posts');
const auth = require('../lib/admin-config');
const { render } = require('../lib/markdown');

const router = express.Router();

// Gate every admin API call. Password comes from the owner's first-run setup
// (stored on the app) or an ADMIN_PASSWORD env var if they'd rather pin it.
// The UI sends `Authorization: Basic base64("admin:<password>")` via fetch, so
// no native browser prompt appears. 409 = not set up yet (client shows setup).
function requirePassword(req, res, next) {
  if (!auth.isConfigured()) return res.status(409).json({ error: 'not_configured' });
  const header = req.headers.authorization || '';
  const m = header.match(/^Basic\s+(.+)$/i);
  if (!m) return res.status(401).json({ error: 'unauthorized' });
  const decoded = Buffer.from(m[1], 'base64').toString('utf8');
  const password = decoded.slice(decoded.indexOf(':') + 1);
  if (!auth.verify(password)) return res.status(401).json({ error: 'unauthorized' });
  next();
}

// Admin shell (setup + login + editor UI). Not itself sensitive — it holds no
// data and every API call it makes is gated by requirePassword.
router.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin.html'));
});

// Unprotected: tells the client whether to show first-run setup or login.
router.get('/api/admin/status', (req, res) => {
  res.json({ configured: auth.isConfigured(), envManaged: auth.envManaged() });
});

// First-run: claim the admin by creating a password. Only works while unset.
router.post('/api/admin/setup', (req, res) => {
  try {
    auth.setup((req.body && req.body.password) || '');
    res.status(201).json({ ok: true });
  } catch (e) {
    const status = e.message === 'already_configured' ? 409 : 400;
    res.status(status).json({ error: e.message });
  }
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
