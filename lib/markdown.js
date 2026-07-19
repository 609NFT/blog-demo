const MarkdownIt = require('markdown-it');

// html:false keeps rendered output safe to inline (no raw HTML from post bodies).
const md = new MarkdownIt({ html: false, linkify: true, typographer: true });

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-') || 'section';
}

// Render markdown, then inject stable ids + a hover anchor onto h2/h3 and collect
// a table of contents. Returns { html, toc: [{ level, text, id }] }.
function render(body) {
  const raw = md.render(String(body || ''));
  const toc = [];
  const seen = {};
  const html = raw.replace(/<(h[23])>([\s\S]*?)<\/\1>/g, (_m, tag, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').trim();
    let id = slugify(text);
    if (seen[id]) { seen[id] += 1; id = `${id}-${seen[id]}`; } else { seen[id] = 1; }
    toc.push({ level: tag === 'h2' ? 2 : 3, text, id });
    return `<${tag} id="${id}">${inner}<a class="heading-anchor" href="#${id}" aria-label="Link to this section">#</a></${tag}>`;
  });
  return { html, toc };
}

module.exports = { render, slugify };
