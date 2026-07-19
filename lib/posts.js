const POSTS = [
  {
    slug: 'shipping-without-a-roadmap',
    title: 'Shipping Without a Roadmap',
    date: '2026-04-12',
    category: 'product',
    author: 'Jordan Patel',
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
];

function list({ category } = {}) {
  if (!category) return POSTS.map(({ body, ...rest }) => rest);
  return POSTS.filter((p) => p.category === category).map(({ body, ...rest }) => rest);
}

function getBySlug(slug) {
  return POSTS.find((p) => p.slug === slug) || null;
}

function categories() {
  const counts = {};
  POSTS.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
  return Object.entries(counts).map(([slug, count]) => ({ slug, count }));
}

module.exports = { list, getBySlug, categories };
