const blog = (() => {
  async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`request failed: ${res.status}`);
    return res.json();
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  }

  function fmtDate(d) {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  const plural = (n, word) => `${n} ${word}${n !== 1 ? 's' : ''}`;

  async function bindHome() {
    const listEl = document.getElementById('post-list');
    const featuredEl = document.getElementById('featured');
    const filterBar = document.getElementById('filter-bar');
    const tagCloud = document.getElementById('tag-cloud');
    const searchInput = document.getElementById('search');
    const searchClear = document.getElementById('search-clear');
    const resultInfo = document.getElementById('result-info');

    let allPosts = [];

    function card(p, opts = {}) {
      const rt = p.readingTime ? `<span class="dot">·</span><span>${p.readingTime} min</span>` : '';
      const tags = (p.tags || []).length
        ? `<div class="card-tags">${p.tags.map((t) => `<span class="tag">#${esc(t)}</span>`).join('')}</div>` : '';
      const snippet = opts.snippet && p.snippet ? `<p class="post-snippet muted">${esc(p.snippet)}</p>` : '';
      return `<a class="post-card" href="/post/${esc(p.slug)}">
        <div class="post-meta"><span class="post-cat">${esc(p.category)}</span><span class="dot">·</span><span>${fmtDate(p.date)}</span>${rt}</div>
        <h2 class="post-title">${esc(p.title)}</h2>
        <p class="post-excerpt">${esc(p.excerpt)}</p>
        ${snippet}
        <div class="post-foot"><span class="post-author muted">by ${esc(p.author)}</span>${tags}</div>
      </a>`;
    }

    function featuredCard(p) {
      return `<a class="featured-card" href="/post/${esc(p.slug)}">
        <span class="featured-badge">Featured</span>
        <div class="post-meta"><span class="post-cat">${esc(p.category)}</span><span class="dot">·</span><span>${fmtDate(p.date)}</span>${p.readingTime ? `<span class="dot">·</span><span>${p.readingTime} min read</span>` : ''}</div>
        <h2 class="featured-title">${esc(p.title)}</h2>
        <p class="featured-excerpt">${esc(p.excerpt)}</p>
        <span class="read-more">Read the post →</span>
      </a>`;
    }

    const setActiveCat = (cat) => filterBar.querySelectorAll('.cat').forEach((b) => b.classList.toggle('active', (b.dataset.cat || '') === cat));
    const setActiveTag = (tag) => tagCloud.querySelectorAll('.tag-chip').forEach((b) => b.classList.toggle('active', (b.dataset.tag || '') === tag));

    function showDefault(list) {
      featuredEl.hidden = false;
      resultInfo.hidden = true;
      const [first, ...rest] = list;
      featuredEl.innerHTML = first ? featuredCard(first) : '';
      listEl.innerHTML = rest.length ? rest.map((p) => card(p)).join('') : (first ? '' : '<p class="muted">No posts yet.</p>');
    }

    function showList(list, label, opts = {}) {
      featuredEl.hidden = true;
      featuredEl.innerHTML = '';
      resultInfo.hidden = false;
      resultInfo.textContent = label;
      listEl.innerHTML = list.length ? list.map((p) => card(p, opts)).join('') : '<p class="muted">Nothing matched. Try another search.</p>';
    }

    try {
      const [{ posts }, { categories }, { tags }] = await Promise.all([
        fetchJSON('/api/posts'),
        fetchJSON('/api/categories'),
        fetchJSON('/api/tags'),
      ]);
      allPosts = posts;
      filterBar.innerHTML = `<button class="cat active" data-cat="">All</button>` +
        categories.map((c) => `<button class="cat" data-cat="${esc(c.slug)}">${esc(c.slug)} <span class="cat-count">${c.count}</span></button>`).join('');
      tagCloud.innerHTML = tags.map((t) => `<button class="tag-chip" data-tag="${esc(t.slug)}">#${esc(t.slug)} <span class="cat-count">${t.count}</span></button>`).join('');
      showDefault(posts);
    } catch (e) {
      listEl.innerHTML = '<p class="muted">Couldn\'t load posts. Please try again.</p>';
      return;
    }

    async function byCategory(cat) {
      setActiveTag(''); setActiveCat(cat);
      if (!cat) { showDefault(allPosts); return; }
      const { posts } = await fetchJSON('/api/posts?category=' + encodeURIComponent(cat));
      showList(posts, `${plural(posts.length, 'post')} in ${cat}`);
    }
    async function byTag(tag) {
      setActiveCat(''); setActiveTag(tag);
      const { posts } = await fetchJSON('/api/posts?tag=' + encodeURIComponent(tag));
      showList(posts, `${plural(posts.length, 'post')} tagged #${tag}`);
    }
    function runSearch(q) {
      if (!q.trim()) { setActiveCat(''); setActiveTag(''); showDefault(allPosts); return; }
      fetchJSON('/api/search?q=' + encodeURIComponent(q)).then(({ results }) => {
        setActiveCat(''); setActiveTag('');
        showList(results, `${plural(results.length, 'result')} for “${q}”`, { snippet: true });
      }).catch(() => {});
    }

    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.cat');
      if (!btn) return;
      searchInput.value = ''; searchClear.hidden = true;
      byCategory(btn.dataset.cat || '');
    });

    tagCloud.addEventListener('click', (e) => {
      const btn = e.target.closest('.tag-chip');
      if (!btn) return;
      searchInput.value = ''; searchClear.hidden = true;
      if (btn.classList.contains('active')) { byCategory(''); } // toggle off
      else byTag(btn.dataset.tag);
    });

    let timer;
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value;
      searchClear.hidden = !q;
      clearTimeout(timer);
      timer = setTimeout(() => runSearch(q), 180);
    });
    searchClear.addEventListener('click', () => {
      searchInput.value = ''; searchClear.hidden = true; searchInput.focus(); runSearch('');
    });

    // Deep links from post-page tag links and shared URLs: /?tag= /?category= /?q=
    const params = new URLSearchParams(location.search);
    if (params.get('q')) { searchInput.value = params.get('q'); searchClear.hidden = false; runSearch(params.get('q')); }
    else if (params.get('tag')) { byTag(params.get('tag')); }
    else if (params.get('category')) { byCategory(params.get('category')); }
  }

  return { bindHome };
})();
