const express = require('express');
const posts = require('../lib/posts');
const { render } = require('../lib/markdown');

const router = express.Router();

// GET /api/posts?category=&tag=  → card list (no body), newest first
router.get('/posts', (req, res) => {
  res.json({ posts: posts.list({ category: req.query.category, tag: req.query.tag }) });
});

// GET /api/posts/:slug → full post + rendered html + toc
router.get('/posts/:slug', (req, res) => {
  const p = posts.getBySlug(req.params.slug);
  if (!p) return res.status(404).json({ error: 'not_found' });
  const { html, toc } = render(p.body);
  res.json({ post: { ...p, html, toc }, related: posts.related(p.slug), adjacent: posts.adjacent(p.slug) });
});

// GET /api/search?q= → ranked card results with a match snippet
router.get('/search', (req, res) => {
  res.json({ query: req.query.q || '', results: posts.search(req.query.q) });
});

router.get('/categories', (req, res) => {
  res.json({ categories: posts.categories() });
});

router.get('/tags', (req, res) => {
  res.json({ tags: posts.tags() });
});

module.exports = router;
