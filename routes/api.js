const express = require('express');
const MarkdownIt = require('markdown-it');
const posts = require('../lib/posts');

const md = new MarkdownIt({ html: false, linkify: true, typographer: true });

const router = express.Router();

router.get('/posts', (req, res) => {
  res.json({ posts: posts.list({ category: req.query.category }) });
});

router.get('/posts/:slug', (req, res) => {
  const p = posts.getBySlug(req.params.slug);
  if (!p) return res.status(404).json({ error: 'not_found' });
  res.json({ post: { ...p, html: md.render(p.body) } });
});

router.get('/categories', (req, res) => {
  res.json({ categories: posts.categories() });
});

module.exports = router;
