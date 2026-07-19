const express = require('express');
const MarkdownIt = require('markdown-it');
const posts = require('../lib/posts');

const md = new MarkdownIt({ html: false, linkify: true, typographer: true });

const router = express.Router();

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function readingTime(text) {
  const words = (text || '').trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

// Server-rendered post page: crawlers and link unfurlers get real title,
// meta description, Open Graph tags, and the article body in the initial HTML.
router.get('/post/:slug', (req, res) => {
  const post = posts.getBySlug(req.params.slug);
  if (!post) {
    return res.status(404).send('<!DOCTYPE html><meta charset="utf-8"><title>Not found · Notes</title><p>Post not found.</p>');
  }

  const title = `${post.title} · Notes`;
  const description = (post.excerpt || '').slice(0, 300);
  const dateLabel = new Date(post.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  // Trusted: md is configured with html:false, so rendered output is safe to inline.
  const bodyHtml = md.render(post.body);

  res.type('html').send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<meta property="og:type" content="article" />
<meta property="og:title" content="${esc(post.title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:image" content="https://vibekit.bot/public/og-vibekit.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(post.title)}" />
<meta name="twitter:description" content="${esc(description)}" />
<meta name="twitter:image" content="https://vibekit.bot/public/og-vibekit.png" />
<meta name="theme-color" content="#fdfcfa" />
<link rel="icon" href="data:image/svg+xml,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%20100%20100%22><rect%20x=%2212%22%20y=%2212%22%20width=%2276%22%20height=%2276%22%20rx=%2218%22%20fill=%22%23d97706%22/></svg>" />
<link rel="stylesheet" href="/styles.css" />
</head>
<body>
<header class="nav">
  <a class="brand" href="/">Notes</a>
  <nav>
    <a href="/">← Back</a>
  </nav>
</header>

<main class="article-shell">
  <article id="article">
    <header class="article-head">
      <div class="muted">
        <span class="post-cat">${esc(post.category)}</span>
        ·
        ${esc(dateLabel)}
        ·
        ${readingTime(post.body)} min read
      </div>
      <h1>${esc(post.title)}</h1>
      <div class="author muted">by ${esc(post.author)}</div>
    </header>
    <div class="prose">${bodyHtml}</div>
  </article>
</main>

<footer>
  <span>Notes. A blog scaffold to fork and make your own.</span>
</footer>
</body>
</html>`);
});

module.exports = router;
