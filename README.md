# Blog Starter

A content site with a real posts API, category filtering, and server-side markdown rendering. 4 seed essays you can replace or extend.

## What's inside

```
blog/
  server.js                # express + /api routes
  lib/posts.js             # 4 seed posts (slug, title, date, category, author, markdown body)
  routes/api.js            # GET /api/posts, /api/posts/:slug, /api/categories
  public/index.html        # post list + category filter
  public/post.html         # single post (markdown rendered server-side via markdown-it)
  public/app.js            # frontend wiring
  public/styles.css        # serif body, sans UI
```

## Start it locally

```bash
npm install
npm start
```

Open http://localhost:3000.

## Markdown

Posts are markdown strings in `lib/posts.js`. `markdown-it` renders them server-side and ships the HTML to the browser via `GET /api/posts/:slug`. To add a post: append an object to the `POSTS` array.

## Ask the agent

- "Add an admin page where I can write new posts in a textarea."
- "Add a newsletter signup form that stores emails."
- "Move the posts from lib/posts.js to a JSON file so I can edit them without restarting."
