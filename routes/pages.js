const express = require('express');
const posts = require('../lib/posts');
const { render } = require('../lib/markdown');

const router = express.Router();

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function readingTime(text) {
  const words = (text || '').trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 220));
}

function initials(name) {
  return String(name || '?').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

function fmtDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function baseUrl(req) {
  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  return `${proto}://${req.get('host')}`;
}

function postCard(p) {
  const meta = `<span class="post-cat">${esc(p.category)}</span><span class="dot">·</span><span>${esc(fmtDate(p.date))}</span>`;
  return `<a class="mini-card" href="/post/${esc(p.slug)}">
    <div class="post-meta">${meta}</div>
    <h3>${esc(p.title)}</h3>
    <p class="muted">${esc(p.excerpt)}</p>
  </a>`;
}

// ---- RSS feed --------------------------------------------------------------
router.get('/feed.xml', (req, res) => {
  const base = baseUrl(req);
  const items = posts.all().map((p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${base}/post/${esc(p.slug)}</link>
      <guid isPermaLink="true">${base}/post/${esc(p.slug)}</guid>
      <category>${esc(p.category)}</category>
      <dc:creator>${esc(p.author)}</dc:creator>
      <pubDate>${new Date(p.date + 'T09:00:00Z').toUTCString()}</pubDate>
      <description>${esc(p.excerpt)}</description>
    </item>`).join('\n');
  res.type('application/rss+xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Notes</title>
    <link>${base}/</link>
    <description>A blog scaffold to fork and make your own.</description>
    <language>en</language>
${items}
  </channel>
</rss>`);
});

// ---- Server-rendered post page --------------------------------------------
router.get('/post/:slug', (req, res) => {
  const post = posts.getBySlug(req.params.slug);
  if (!post) {
    return res.status(404).send('<!DOCTYPE html><meta charset="utf-8"><title>Not found · Notes</title><p>Post not found.</p>');
  }

  const base = baseUrl(req);
  const url = `${base}/post/${post.slug}`;
  const title = `${post.title} · Notes`;
  const description = (post.excerpt || '').slice(0, 300);
  const { html: bodyHtml, toc } = render(post.body);
  const related = posts.related(post.slug);
  const { newer, older } = posts.adjacent(post.slug);

  const tocList = toc.length ? `<ul>${toc.map((t) => `<li class="lvl-${t.level}"><a href="#${t.id}" data-toc="${t.id}">${esc(t.text)}</a></li>`).join('')}</ul>` : '';
  const tocBlock = toc.length ? `<details class="toc" open>
      <summary>Contents</summary>
      <nav aria-label="Table of contents">${tocList}</nav>
    </details>` : '';

  const tagRow = (post.tags || []).length
    ? `<div class="tag-row">${post.tags.map((t) => `<a class="tag" href="/?tag=${encodeURIComponent(t)}">#${esc(t)}</a>`).join('')}</div>` : '';

  const adjBlock = (newer || older) ? `<nav class="post-nav">
      ${older ? `<a class="pn older" href="/post/${esc(older.slug)}"><span class="pn-label">← Older</span><span class="pn-title">${esc(older.title)}</span></a>` : '<span></span>'}
      ${newer ? `<a class="pn newer" href="/post/${esc(newer.slug)}"><span class="pn-label">Newer →</span><span class="pn-title">${esc(newer.title)}</span></a>` : '<span></span>'}
    </nav>` : '';

  const relatedBlock = related.length ? `<section class="related">
      <h2 class="section-label">Related</h2>
      <div class="mini-grid">${related.map(postCard).join('')}</div>
    </section>` : '';

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
<meta property="og:url" content="${esc(url)}" />
<meta property="og:image" content="https://vibekit.bot/public/og-vibekit.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(post.title)}" />
<meta name="twitter:description" content="${esc(description)}" />
<meta name="twitter:image" content="https://vibekit.bot/public/og-vibekit.png" />
<meta name="theme-color" content="#fdfcfa" />
<link rel="alternate" type="application/rss+xml" title="Notes RSS" href="/feed.xml" />
<link rel="icon" href="data:image/svg+xml,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%20100%20100%22><rect%20x=%2212%22%20y=%2212%22%20width=%2276%22%20height=%2276%22%20rx=%2218%22%20fill=%22%23d97706%22/></svg>" />
<link rel="stylesheet" href="/styles.css" />
</head>
<body>
<div class="read-progress" id="read-progress" aria-hidden="true"></div>
<header class="nav">
  <a class="brand" href="/">Notes</a>
  <form class="nav-search" action="/" role="search">
    <svg class="search-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
    <input name="q" type="search" placeholder="Search posts…" autocomplete="off" aria-label="Search posts" />
  </form>
  <nav>
    <a href="/">Home</a>
    <a href="/feed.xml">RSS</a>
  </nav>
</header>

<main class="article-layout">
  ${tocBlock}
  <article id="article">
    <header class="article-head">
      <div class="muted meta-line">
        <span class="post-cat">${esc(post.category)}</span>
        <span class="dot">·</span>
        <span>${esc(fmtDate(post.date))}</span>
        <span class="dot">·</span>
        <span>${readingTime(post.body)} min read</span>
      </div>
      <h1>${esc(post.title)}</h1>
      <div class="byline">
        <span class="avatar" aria-hidden="true">${esc(initials(post.author))}</span>
        <span>by <strong>${esc(post.author)}</strong></span>
      </div>
      ${tagRow}
      <div class="share-row">
        <button class="share-btn" id="copy-link" type="button">Copy link</button>
        <a class="share-btn" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}" target="_blank" rel="noopener">Share on X</a>
      </div>
    </header>
    <div class="prose">${bodyHtml}</div>
    ${tagRow}
    ${adjBlock}
    ${relatedBlock}
  </article>
</main>

<button class="to-top" id="to-top" aria-label="Back to top" title="Back to top">↑</button>

<footer>
  <span>Notes. A blog scaffold to fork and make your own. · <a href="/feed.xml">RSS</a> · <a href="/admin">Admin</a></span>
</footer>

<script>
  // Reading progress bar
  const bar = document.getElementById('read-progress');
  const article = document.getElementById('article');
  const toTop = document.getElementById('to-top');
  const tocLinks = [...document.querySelectorAll('[data-toc]')];
  const headings = [...document.querySelectorAll('.prose h2, .prose h3')];

  function onScroll() {
    const rect = article.getBoundingClientRect();
    const total = article.offsetHeight - window.innerHeight;
    const scrolled = Math.min(1, Math.max(0, (-rect.top) / (total > 0 ? total : 1)));
    bar.style.transform = 'scaleX(' + scrolled + ')';
    toTop.classList.toggle('show', window.scrollY > 600);

    // Active TOC entry = the last heading whose top has passed ~120px.
    if (tocLinks.length) {
      let activeId = headings.length ? headings[0].id : null;
      for (const h of headings) { if (h.getBoundingClientRect().top <= 120) activeId = h.id; else break; }
      tocLinks.forEach((a) => a.classList.toggle('active', a.dataset.toc === activeId));
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const copyBtn = document.getElementById('copy-link');
  if (copyBtn) copyBtn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(window.location.href); copyBtn.textContent = 'Copied!'; }
    catch (_) { copyBtn.textContent = 'Copy failed'; }
    setTimeout(() => { copyBtn.textContent = 'Copy link'; }, 1600);
  });
</script>
</body>
</html>`);
});

module.exports = router;
