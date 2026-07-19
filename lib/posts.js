const POSTS = [
  {
    slug: 'shipping-without-a-roadmap',
    title: 'Shipping Without a Roadmap',
    date: '2026-04-12',
    category: 'product',
    author: 'Jordan Patel',
    tags: ['process', 'shipping', 'prioritization'],
    excerpt: 'How we replaced a 12-month roadmap with a 12-day cadence — and shipped more in the first quarter than the previous year.',
    body: `## The roadmap was a wish list

The roadmap had 47 items. Some were two years old. We argued every quarter about which ones to keep. Nothing on the list had a customer attached.

The week we deleted it, we shipped three things that had been "next quarter" for six months. Turns out the roadmap wasn't a plan; it was a graveyard for ideas we couldn't kill.

## What replaced it

A 12-day cadence. Pick the highest-pain customer problem on Monday, ship something to a real customer by Friday week-after-next. Skip standups. Skip retros. Talk to the customer instead.

The constraint is brutal: if you can't get to a real customer in 12 days, the problem is too big or the solution is too speculative. Either way, it doesn't ship. We picked something smaller.

## What broke

Our finance team hated it. They wanted a 12-month forecast tied to feature dates. We told them we could forecast revenue but not features, because features that don't ship don't move revenue. They came around when we hit Q1 targets without a single feature missing from a list they never saw.

## What it costs

You give up the comfort of a long-term narrative. There's no "Q3 vision deck." There's just: what hurt the most this week, what we shipped, who used it. Some people on the team needed the narrative more than I thought. We lost two of them.

It also requires saying no every Monday. To investors, to internal champions, to your own ideas. The 12-day clock is a forcing function for ruthless prioritization.

## What's next

We're keeping it. The team that stayed prefers it. We ship more. Customers see motion. The roadmap is dead.`,
  },
  {
    slug: 'on-not-hiring-too-fast',
    title: 'On Not Hiring Too Fast',
    date: '2026-03-28',
    category: 'team',
    author: 'Avery Chen',
    tags: ['hiring', 'scaling', 'process'],
    excerpt: 'A six-person team can ship a $5M product. The eighth and ninth hire are where things start to slow down.',
    body: `## The myth of the hiring curve

Investors love a hiring chart that goes up and to the right. It implies progress. It also implies velocity, which is exactly backwards: each new hire slows the team down for the first 90 days before they speed it back up.

Six people working in the same room with a shared mental model is a velocity machine. The seventh person needs onboarding docs. The eighth needs a manager. By the tenth you've spent more on coordination than you used to spend on the whole team.

## The shape of work

Most early-stage products fail because of unclear customer demand, not lack of engineering. When demand is unclear, more engineers means more bets with worse hit rates. The smart move is fewer people, more thinking time, faster validation cycles.

I see this play out the same way every time. A founder with five engineers and product-market fit raises money, hires ten more engineers, and a year later the product is bigger but no clearer than it was. Bigger isn't better. Clearer is better.

## When to actually hire

Hire when a single problem is consistently blocking three or more people. Hire when you can describe the role's deliverables for the first 90 days in three sentences. Hire when you've already tried doing the work yourself for two weeks and concluded you can't sustain it.

Otherwise, wait. The cost of a wrong hire is not just their salary — it's the dilution of culture, the redistribution of attention, the new coordination overhead. None of that shows up on a budget line.`,
  },
  {
    slug: 'the-quiet-cost-of-meetings',
    title: 'The Quiet Cost of Meetings',
    date: '2026-03-04',
    category: 'team',
    author: 'Riley Kim',
    tags: ['process', 'focus', 'async'],
    excerpt: 'A 30-minute meeting with eight people costs four hours. Most of those meetings aren\'t worth the cheapest one of those hours.',
    body: `## The math

A 30-minute meeting with eight people is four person-hours. If those people earn $150k on average, that meeting costs roughly $300 in salary alone — before counting the context-switch tax on the heads-down work it interrupted.

We don't do that math. We just put the meeting on the calendar.

## The defaults are wrong

Calendar tools default to 30 minutes. Meeting invites default to "Required" instead of "Optional." Recurring meetings default to forever. Each of those defaults is a small bet against your team's focus, repeated thousands of times.

Flip them all. Default to 15 minutes. Default to "Optional." Cancel any recurring meeting that hasn't produced a decision in three cycles.

## The replacement

Most meetings are status updates that should be a written async post. The post forces clarity, leaves a searchable record, and lets people respond on their own time. Status syncs done in real-time are an optimization for the loudest voice in the room.

If you need a meeting, write the agenda first. If you can't write the agenda, you don't need the meeting; you need to think more before involving other people. The agenda is the bar.

## What we kept

Customer calls. Real decisions. Heart-to-hearts when something is going wrong. That's it. Everything else is async.

Our calendar got 60% emptier in eight weeks. Output went up.`,
  },
  {
    slug: 'design-systems-are-a-tax',
    title: 'Design Systems Are a Tax (Pay It Anyway)',
    date: '2026-02-18',
    category: 'design',
    author: 'Sage Holloway',
    tags: ['design-systems', 'scaling', 'craft'],
    excerpt: 'The first six months of a design system feel like pure overhead. The next six months are why every serious product eventually builds one.',
    body: `## Why most early teams skip it

Building a design system feels like building a thing nobody asked for. The roadmap doesn't say "make a Button component." The customer doesn't say "your colors should be in a token file." So you build the feature, ship it, move on.

That's fine for a while. Then someone has to add a feature that needs a button slightly different from the seven other buttons. They make an eighth. Now the page is inconsistent. The fix is "go update the other seven," which nobody has time for. So the inconsistency becomes permanent.

## The tipping point

Around the fifth or sixth shipped feature, the cost of inconsistency overtakes the cost of building the system. You spend half a sprint untangling buttons that should have been the same. You ship UI changes that look wrong because the spacing is off by 4px in three places.

This is the moment to invest. Not before. The system that's right for a product with five screens is overkill; the system that's right for a product with fifty screens is essential.

## What to actually build

Start with tokens: color, spacing, radius, font. That's a one-day project that compounds for years. Add primitives next: Button, Input, Card. Build the next feature using only those primitives. When you can't, add a primitive — don't fork the existing one.

Don't start with "design language documentation." Documentation is a description of the system, not the system itself. Build the system; document what you actually built.

## The honest cost

It's a tax. Every feature pays a 10-15% surcharge to use the system instead of one-off styles. But the alternative — the constant low-grade tax of inconsistency, the special-cased CSS, the "make it match the mockup" rework — adds up to more. Always.`,
  },
  {
    slug: 'the-case-for-boring-technology',
    title: 'The Case for Boring Technology',
    date: '2026-02-02',
    category: 'engineering',
    author: 'Devon Foster',
    tags: ['architecture', 'pragmatism', 'reliability'],
    excerpt: 'Every exciting piece of infrastructure you adopt is a promise to debug it at 3am. Choose boring on purpose.',
    body: `## Novelty has a bill

New databases, new queues, new frameworks — each one is exciting on the demo and expensive at scale. The excitement is front-loaded; the bill arrives later, usually during an incident, usually alone.

Boring technology has a property that novel technology can't fake: someone has already hit your bug and written it down. The Stack Overflow answer exists. The failure modes are documented. The 3am incident has a known runbook.

## The innovation budget

You get to make maybe three genuinely novel technical bets. Spend them where they're your actual advantage — the thing customers pay you for — and buy everything else off the shelf, in the most boring, well-trodden form you can find.

A startup that picks a novel database, a novel language, and a novel deployment model has spent its entire innovation budget on infrastructure nobody will ever pay for. The product itself, the only thing that matters, gets the leftovers.

## What boring buys you

Predictability. When Postgres is slow, ten thousand engineers have already diagnosed why. When your bespoke event store is slow, you are the world's leading expert, and you're debugging it during an outage.

Boring is not the same as bad. Boring means proven. Choose it on purpose, and save your daring for the problem that's actually yours.`,
  },
  {
    slug: 'pricing-is-a-product-decision',
    title: 'Pricing Is a Product Decision',
    date: '2026-01-20',
    category: 'product',
    author: 'Jordan Patel',
    tags: ['pricing', 'strategy', 'shipping'],
    excerpt: 'Teams treat pricing as a spreadsheet exercise for the finance team. It is the single loudest thing your product says about who it is for.',
    body: `## Price is positioning

Before a customer uses a single feature, your price has already told them what kind of product this is. A $9 tool and a $900 tool can do the identical thing and attract completely different people, with completely different expectations of support, reliability, and polish.

That means pricing is not a number you calculate at the end. It's a decision you make near the beginning, because it shapes who shows up and what they'll forgive.

## The willingness-to-pay trap

"What will people pay?" is the wrong first question. The right one is "who do I want as a customer, and what does that person expect to pay for a thing that solves this?" Willingness to pay is downstream of who you're building for.

Cheap customers are often the most expensive: they file the most tickets, churn the fastest, and ask for the most features per dollar. Pricing up is frequently a support-load decision disguised as a revenue one.

## Change it more often than feels safe

Most teams set a price once and treat it as permanent. It isn't. Raise it on new signups, grandfather the old cohort, watch conversion. If conversion barely moves, you were underpriced and just found free margin. If it craters, you learned something cheaply.

Pricing is a product surface. Ship changes to it like you ship anything else: small, frequent, measured.`,
  },
  {
    slug: 'white-space-is-not-empty',
    title: 'White Space Is Not Empty',
    date: '2026-01-06',
    category: 'design',
    author: 'Sage Holloway',
    tags: ['typography', 'craft', 'design-systems'],
    excerpt: 'The fastest way to make a product feel expensive is to remove things until the ones that remain can breathe.',
    body: `## The instinct to fill

A blank area of a screen feels like waste, so we fill it — another badge, another tooltip, a third call to action. Each addition is individually defensible and collectively suffocating. The result reads as cheap, because cheap products are the ones that shout.

Space is not the absence of design. It's the design decision that makes everything else legible. The eye needs somewhere to rest to understand where to look.

## Hierarchy is spacing

Most "make it pop" requests are actually spacing problems. The heading doesn't need to be bigger; the paragraph below it needs more room above it. Grouping by proximity does more for comprehension than any font size ever will.

When two things are close, the reader assumes they're related. When they're far apart, separate. You can express an entire information hierarchy with nothing but distance.

## The subtraction pass

Before shipping any screen, do one pass whose only job is removal. Delete a divider. Merge two labels. Cut the third button. Ask of every element: if this were gone, what would break? Usually nothing breaks, and the screen gets quieter and more expensive-looking at once.

Restraint is the most underrated skill in interface design. Anyone can add. The craft is knowing what to leave out.`,
  },
  {
    slug: 'delete-code-to-go-faster',
    title: 'Delete Code to Go Faster',
    date: '2025-12-15',
    category: 'engineering',
    author: 'Devon Foster',
    tags: ['refactoring', 'simplicity', 'pragmatism'],
    excerpt: 'The codebase you can hold in your head ships features in an afternoon. The one you can\'t takes a week and a meeting.',
    body: `## Lines are a liability

We measure output in lines added, but every line is something to read, test, and eventually debug. The best pull request of my year deleted 4,000 lines and added 60. It made three "hard" features become easy, because the hard part had always been the code, not the problem.

Code is not an asset that accrues value. It's inventory that accrues cost. The goal is the least code that solves the problem, not the most.

## The abstraction that wasn't earned

Premature abstraction is how simple things become complicated. Someone anticipates a future that never arrives and builds a flexible system for it. Now every real change has to route around the flexibility that was added for imaginary cases.

Write the boring, repetitive version first. Let the duplication sit there until the third occurrence tells you the real shape of the abstraction. Abstractions discovered from three real cases are load-bearing; abstractions guessed from zero are scaffolding you'll trip over.

## Deletion as a feature

Schedule it. Once a quarter, spend a week whose only deliverable is less code: dead endpoints, feature flags that resolved months ago, the config option nobody sets. Nothing ships to the user, and the team gets measurably faster for the next quarter.

The codebase you can hold in your head is the one where features take an afternoon. Protect that. Delete to keep it.`,
  },
];

function readingTime(body) {
  const words = String(body || '').trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 220));
}

// Card shape: drop the heavy body, add a computed reading time.
function toCard(p) {
  const { body, ...rest } = p;
  return { ...rest, readingTime: readingTime(body) };
}

// List for cards: strip the heavy body, keep everything else. Newest first.
function list({ category, tag } = {}) {
  let rows = POSTS.slice();
  if (category) rows = rows.filter((p) => p.category === category);
  if (tag) rows = rows.filter((p) => (p.tags || []).includes(tag));
  return rows
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(toCard);
}

function getBySlug(slug) {
  return POSTS.find((p) => p.slug === slug) || null;
}

function categories() {
  const counts = {};
  POSTS.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
  return Object.entries(counts)
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}

function tags() {
  const counts = {};
  POSTS.forEach((p) => (p.tags || []).forEach((t) => { counts[t] = (counts[t] || 0) + 1; }));
  return Object.entries(counts)
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}

// Full-text-ish search across title, excerpt, body, tags, author, category.
// Returns card-shaped results (no body) plus a short snippet around the first
// body match so the reader sees why it matched.
function search(query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  const scored = [];
  for (const p of POSTS) {
    const hay = {
      title: p.title.toLowerCase(),
      excerpt: p.excerpt.toLowerCase(),
      body: p.body.toLowerCase(),
      tags: (p.tags || []).join(' ').toLowerCase(),
      author: p.author.toLowerCase(),
      category: p.category.toLowerCase(),
    };
    let score = 0;
    for (const t of terms) {
      if (hay.title.includes(t)) score += 10;
      if (hay.tags.includes(t)) score += 6;
      if (hay.excerpt.includes(t)) score += 4;
      if (hay.category.includes(t)) score += 3;
      if (hay.author.includes(t)) score += 3;
      if (hay.body.includes(t)) score += 1;
    }
    if (score === 0) continue;
    scored.push({ ...toCard(p), score, snippet: snippetFor(p.body, terms) });
  }
  return scored.sort((a, b) => b.score - a.score).map(({ score, ...r }) => r);
}

function snippetFor(body, terms) {
  const plain = body.replace(/[#>*`_-]/g, ' ').replace(/\s+/g, ' ').trim();
  const lower = plain.toLowerCase();
  let idx = -1;
  for (const t of terms) { const i = lower.indexOf(t); if (i !== -1 && (idx === -1 || i < idx)) idx = i; }
  if (idx === -1) return plain.slice(0, 140) + '…';
  const start = Math.max(0, idx - 60);
  return (start > 0 ? '…' : '') + plain.slice(start, start + 150).trim() + '…';
}

// Related: same category + shared tags rank first; if fewer than `limit` truly
// relate, backfill with the most recent other posts so the section is never thin.
function related(slug, limit = 3) {
  const self = getBySlug(slug);
  if (!self) return [];
  const selfTags = new Set(self.tags || []);
  const ranked = POSTS.filter((p) => p.slug !== slug)
    .map((p) => {
      const shared = (p.tags || []).filter((t) => selfTags.has(t)).length;
      return { p, score: (p.category === self.category ? 2 : 0) + shared };
    })
    .sort((a, b) => b.score - a.score || (a.p.date < b.p.date ? 1 : -1))
    .slice(0, limit)
    .map(({ p }) => toCard(p));
  return ranked;
}

// Chronological neighbours for prev/next nav (newer / older).
function adjacent(slug) {
  const ordered = POSTS.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
  const i = ordered.findIndex((p) => p.slug === slug);
  return { newer: ordered[i - 1] ? toCard(ordered[i - 1]) : null, older: ordered[i + 1] ? toCard(ordered[i + 1]) : null };
}

function all() { return POSTS.slice().sort((a, b) => (a.date < b.date ? 1 : -1)); }

module.exports = { list, getBySlug, categories, tags, search, related, adjacent, all };
