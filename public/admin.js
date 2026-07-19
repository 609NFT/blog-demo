(() => {
  const KEY = 'notes.admin.pw';
  let password = sessionStorage.getItem(KEY) || '';
  let posts = [];
  let editing = null;   // slug being edited, or null for a new post
  let slugTouched = false;

  const $ = (id) => document.getElementById(id);
  const authHeader = () => 'Basic ' + btoa('admin:' + password);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const slugify = (s) => String(s).toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 80);

  async function api(method, url, body) {
    const res = await fetch(url, {
      method,
      headers: { Authorization: authHeader(), ...(body ? { 'Content-Type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 401) { signout(); throw new Error('Session expired — sign in again'); }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || data.error || ('HTTP ' + res.status));
    return data;
  }

  function toast(msg) {
    const t = $('toast');
    t.textContent = msg; t.hidden = false;
    void t.offsetWidth; t.classList.add('show');
    clearTimeout(t._t);
    t._t = setTimeout(() => { t.classList.remove('show'); setTimeout(() => { t.hidden = true; }, 250); }, 1900);
  }

  // ---- Auth ----
  $('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    password = $('password').value;
    const err = $('login-error');
    err.hidden = true;
    try {
      const res = await fetch('/api/admin/verify', { headers: { Authorization: authHeader() } });
      if (res.status === 503) { const d = await res.json().catch(() => ({})); err.textContent = d.message || 'Admin is disabled.'; err.hidden = false; return; }
      if (!res.ok) { err.textContent = 'Wrong password.'; err.hidden = false; return; }
      sessionStorage.setItem(KEY, password);
      enterApp();
    } catch (_) { err.textContent = 'Could not reach the server.'; err.hidden = false; }
  });

  function signout() {
    sessionStorage.removeItem(KEY); password = '';
    $('app').hidden = true; $('login').hidden = false; $('password').value = '';
  }
  $('signout').onclick = signout;

  async function enterApp() {
    $('login').hidden = true; $('app').hidden = false;
    await loadPosts();
  }

  // ---- Post list ----
  async function loadPosts() {
    const { posts: rows } = await api('GET', '/api/admin/posts');
    posts = rows;
    $('post-count').textContent = rows.length + (rows.length === 1 ? ' post' : ' posts');
    $('post-list').innerHTML = rows.map((p) => `
      <li class="${editing === p.slug ? 'active' : ''}">
        <button class="post-item" data-edit="${esc(p.slug)}">
          <span class="pi-title">${esc(p.title)}</span>
          <span class="pi-meta muted">${esc(p.category)} · ${esc(p.date)}</span>
        </button>
      </li>`).join('');
    $('post-list').querySelectorAll('[data-edit]').forEach((b) => { b.onclick = () => editPost(b.dataset.edit); });
  }

  function showEditor(show) { $('editor').hidden = !show; $('editor-empty').hidden = show; }

  function fill(p) {
    $('f-title').value = p.title || '';
    $('f-slug').value = p.slug || '';
    $('f-date').value = p.date || '';
    $('f-category').value = p.category || '';
    $('f-author').value = p.author || '';
    $('f-tags').value = (p.tags || []).join(', ');
    $('f-excerpt').value = p.excerpt || '';
    $('f-body').value = p.body || '';
    $('preview').hidden = true; $('f-body').hidden = false; $('preview-toggle').textContent = 'Preview';
  }

  function newPost() {
    editing = null; slugTouched = false;
    fill({ date: new Date().toISOString().slice(0, 10) });
    $('delete-btn').hidden = true;
    showEditor(true); loadPosts();
    $('f-title').focus();
  }
  function editPost(slug) {
    const p = posts.find((x) => x.slug === slug);
    if (!p) return;
    editing = slug; slugTouched = true;
    fill(p);
    $('delete-btn').hidden = false;
    showEditor(true); loadPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  $('new-post').onclick = newPost;
  $('cancel-btn').onclick = () => { editing = null; showEditor(false); loadPosts(); };

  // Auto-slug from the title until the user edits the slug field.
  $('f-slug').addEventListener('input', () => { slugTouched = true; });
  $('f-title').addEventListener('input', () => { if (!slugTouched) $('f-slug').value = slugify($('f-title').value); });

  // Preview toggle
  $('preview-toggle').onclick = async () => {
    if (!$('preview').hidden) { $('preview').hidden = true; $('f-body').hidden = false; $('preview-toggle').textContent = 'Preview'; return; }
    try {
      const { html } = await api('POST', '/api/admin/preview', { body: $('f-body').value });
      $('preview').innerHTML = html; $('preview').hidden = false; $('f-body').hidden = true; $('preview-toggle').textContent = 'Edit';
    } catch (err) { toast(err.message); }
  };

  // Save (create or update)
  $('post-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      title: $('f-title').value, slug: $('f-slug').value, date: $('f-date').value,
      category: $('f-category').value, author: $('f-author').value, tags: $('f-tags').value,
      excerpt: $('f-excerpt').value, body: $('f-body').value,
    };
    try {
      let post;
      if (editing) { ({ post } = await api('PUT', '/api/admin/posts/' + editing, payload)); toast('Saved'); }
      else { ({ post } = await api('POST', '/api/admin/posts', payload)); toast('Post created'); }
      editing = post.slug; slugTouched = true; $('delete-btn').hidden = false;
      await loadPosts();
      const fresh = posts.find((x) => x.slug === editing);
      if (fresh) fill(fresh);
    } catch (err) { toast(err.message); }
  });

  // Delete
  $('delete-btn').onclick = async () => {
    if (!editing) return;
    if (!confirm('Delete this post? This cannot be undone.')) return;
    try {
      await api('DELETE', '/api/admin/posts/' + editing);
      toast('Deleted'); editing = null; showEditor(false); await loadPosts();
    } catch (err) { toast(err.message); }
  };

  // Resume a session if the password is already stored.
  if (password) {
    fetch('/api/admin/verify', { headers: { Authorization: authHeader() } })
      .then((r) => { if (r.ok) enterApp(); else signout(); })
      .catch(() => {});
  }
})();
