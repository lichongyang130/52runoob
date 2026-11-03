# Howcompass — Front Office + Admin CMS

**Howcompass** is a full-stack, English-language how-to site: an illustrated public front end,
and a complete editorial back office for writing, publishing and moderating content.
The layout and illustration style are modelled on wikiHow as a design reference; all copy,
artwork and data in this repository are original.

Built with **Next.js 15 (App Router) + React 19**, **SQLite** (better-sqlite3, zero config),
and a hand-drawn **flat vector illustration system** that follows the wikiHow-style house art
(soft tinted panels, rounded characters, no outlines, green accents).

---

## Quick start

```bash
npm install
npm run dev            # http://localhost:3000
```

The SQLite database is created, migrated and seeded automatically on first request
(`data/howcompass.db`). Nothing else to configure.

```bash
npm run build && npm start   # production mode
npm run db:reset             # wipe + reseed the database
```

### Admin login

| | |
|---|---|
| URL | `/admin` |
| Username | `admin` |
| Password | `admin123` |

You can add more editors/admins under **Admin → Users** (admin role only).

---

## What's included

### Public site

| Route | Description |
|---|---|
| `/` | Home: hero with search, category browser, featured rail, latest how-tos, trending list |
| `/categories` | All categories with a preview of each category's articles |
| `/category/[slug]` | Category landing page with pagination and related categories |
| `/how-to` | Full alphabetical index of every article, grouped by category |
| `/how-to/[slug]` | The article page (see below) |
| `/wikiHow/*` | Legacy redirects to `/how-to/*` |
| `/search?q=` | Full-text-ish search over title/summary/intro |
| `/random` | Redirects to a random published how-to |
| `/about`, `/privacy`, `/terms` | Editorial standards, mission, legal pages |
| `/sitemap.xml`, `/robots.txt` | SEO endpoints |
| `404` | Custom not-found page with search |

**Article page features** (modelled on wikiHow's article layout):

- breadcrumb trail, "How to …" title, co-author line, updated date, read time, view count
- hero illustration + reviewer badge
- green **Quick summary** box
- table of contents / "In this article" sidebar that scrolls with you
- numbered **Methods** and per-step illustration panels with step numbers
- **Tips**, **Warnings**, **Things You'll Need**, **FAQ** (accordion)
- "Did this article help you?" voting (writes to DB via `/api/vote`)
- reader **comments** with star ratings (posts via `/api/comments`)
- related how-tos and "more in this category"

### Admin dashboard (`/admin`)

- **Dashboard** — published/draft counts, total views, comments, recent articles, latest comments, category overview
- **Articles** — filter by search text / status / category, publish-unpublish, delete, edit
- **Article editor** — dynamic builder: methods → steps, tips, warnings, FAQ pairs,
  "Things You'll Need", author, category, read time, featured flag, status, and a live
  hero-illustration picker
- **Categories** — create/edit/delete with emoji, color and ordering
- **Comments** — approve/hide and delete
- **Users** — add editor or admin accounts (scrypt-hashed passwords), remove users

Authentication is cookie-based sessions stored in SQLite (`sessions` table), passwords hashed
with `scrypt` — no external auth service required.

---

## Project structure

```
app/
  layout.js                 root layout + metadata
  globals.css               full design system (colors, type, components, responsive)
  (site)/                   public site, wrapped in Header + Footer
    page.js  categories/  category/[slug]/  how-to/  how-to/[slug]/
    search/  random/  about/  privacy/  terms/
  admin/
    login/                  public login screen
    (dashboard)/            auth-guarded shell + dashboard, articles, categories, comments, users
  api/
    vote/route.js           helpful / not-helpful voting
    comments/route.js       post a comment
  sitemap.js  robots.js  not-found.js
components/
  Illustration.js           ~17 flat-vector scenes + <Illustration> / <StepIllustration>
  ArticleCard.js  Header.js  Footer.js  AdminNav.js
  ArticleEditor.js          client-side dynamic article builder
  ArticleInteractions.js    vote box, comment list + form
lib/
  db.js                     SQLite connection, schema migration, auto-seed
  seed-data.js              English content: 12 categories, 10 illustrated articles
  queries.js                all read queries
  admin-actions.js          server actions: login/logout, save article, categories, users
  auth.js  session.js  util.js
data/howcompass.db             generated at runtime (git-ignored)
```

## Content model

`categories → articles → methods → steps`, plus `tips` (kind = `tip` | `warning`),
`faqs`, `things`, `comments` (with rating + approved flag), `users`, `sessions`.
Deletes cascade, so removing an article cleans up its steps, tips, FAQ and comments.

## Illustrations

`components/Illustration.js` contains hand-written SVG scenes (`carbonara`, `tomatoes`,
`guitar`, `puppy`, `watercolor`, `resume`, `cookies`, `money`, `camera`, `stretch`,
`laptop`, `books`, `heart`, `craft`, `paw`, `idea`). Each scene re-tints its background
per step position, so an article's steps each get their own panel — the same trick wikiHow
uses to keep long articles visually rhythmic. Swap a scene or add your own by extending the
`SCENES` map; the admin editor's illustration picker reads from it automatically.

## Notes

- This is a learning/demo project; all text is original English content written for it.
- Health/finance content carries warnings, but nothing here is professional advice.
- Deployment: any Node host works. Set `SITE_URL` for correct sitemap URLs and
  `DATABASE_PATH` if you want the SQLite file outside `./data`.
