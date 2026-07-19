const blog = (() => {
  async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`request failed: ${res.status}`);
    return res.json();
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  }

  function readingTime(text) {
    const words = (text || '').trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 220));
  }

  async function bindHome() {
    const list = document.getElementById('post-list');
    const filterBar = document.getElementById('filter-bar');

    try {
      const [{ posts }, { categories }] = await Promise.all([
        fetchJSON('/api/posts'),
        fetchJSON('/api/categories'),
      ]);

      filterBar.innerHTML = `<button class="cat active" data-cat="">All</button>` +
        categories.map((c) => `<button class="cat" data-cat="${esc(c.slug)}">${esc(c.slug)} <span class="cat-count">${c.count}</span></button>`).join('');

      function render(filtered) {
        if (!filtered.length) {
          list.innerHTML = '<p class="muted">No posts yet.</p>';
          return;
        }
        list.innerHTML = filtered.map((p) => `
          <a class="post-card" href="/post/${esc(p.slug)}">
            <div class="post-meta">
              <span class="post-cat">${esc(p.category)}</span>
              <span class="muted">·</span>
              <span class="muted">${new Date(p.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <h2 class="post-title">${esc(p.title)}</h2>
            <p class="post-excerpt">${esc(p.excerpt)}</p>
            <div class="post-author muted">by ${esc(p.author)}</div>
          </a>
        `).join('');
      }

      render(posts);

      filterBar.querySelectorAll('.cat').forEach((btn) => {
        btn.addEventListener('click', async () => {
          filterBar.querySelectorAll('.cat').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          const cat = btn.dataset.cat;
          const url = cat ? `/api/posts?category=${encodeURIComponent(cat)}` : '/api/posts';
          const { posts: filtered } = await fetchJSON(url);
          render(filtered);
        });
      });
    } catch (e) {
      list.innerHTML = '<p class="muted">Couldn\'t load posts. Please try again.</p>';
    }
  }

  async function bindPost() {
    const article = document.getElementById('article');
    const params = new URLSearchParams(location.search);
    const slug = params.get('slug');
    if (!slug) {
      article.innerHTML = '<p>Post not specified.</p>';
      return;
    }
    try {
      const { post } = await fetchJSON(`/api/posts/${slug}`);
      document.title = `${post.title} · Notes`;
      article.innerHTML = `
        <header class="article-head">
          <div class="muted">
            <span class="post-cat">${esc(post.category)}</span>
            ·
            ${new Date(post.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            ·
            ${readingTime(post.body)} min read
          </div>
          <h1>${esc(post.title)}</h1>
          <div class="author muted">by ${esc(post.author)}</div>
        </header>
        <div class="prose">${post.html}</div>`;
    } catch (e) {
      article.innerHTML = '<p>Post not found.</p>';
    }
  }

  return { bindHome, bindPost };
})();
