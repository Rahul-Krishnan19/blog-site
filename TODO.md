# Roadmap

## Phase 2 (later — not blocking initial launch)

- **In-page comments**: swap the current read-only `Comments` component
  (src/components/Comments.tsx, just displays + links to GitHub) for an
  embedded [giscus](https://giscus.app) widget, so readers can sign in with
  GitHub and comment without leaving the site. Requires the `blog-posts`
  content repo to be public and the giscus GitHub App installed on it.

- **Like feature**: a simple, voluntary like button on posts — no dislike,
  just a one-way "like" a reader can optionally tap. Needs its own design:
  either piggyback on GitHub's native reactions (via giscus, once that's in
  place) or a lightweight anonymous counter (e.g. Vercel KV/Upstash) with
  basic abuse protection (one like per browser via localStorage, since
  there's no reader auth outside of giscus).
