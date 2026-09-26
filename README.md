# Fan Hub Plus — Fandom Universe Portal

An end-to-end fan portal for anime, gaming, movies, TV shows, K-pop, comics, manga
and cosplay communities, built by Visionary Coders against an "End-to-End Web
Solutions" brief (SRS: *Fan Hub Plus*, v1.0).

Everything in this project — routing, sessions, templating, the data store, the
icon set — is written from scratch on top of plain Node.js. There is **no
Express, no MongoDB, no npm install step**. That wasn't the original plan; the
sandbox this was built in had its npm registry access blocked by org policy
mid-build, so rather than stall, the whole stack was rebuilt dependency-free.
It turned out to be a good fit anyway: the SRS explicitly warns against
leaning on ready-made templates and asks you to be able to explain every part
of your own implementation, and a small hand-rolled framework makes that easy
to do honestly.

## 1. Requirements

- Node.js 16 or newer (check with `node -v`). Nothing else.

## 2. Installation & running

```bash
cd FanHub
node server.js
```

Then open **http://localhost:3000**.

That's it — no `npm install`, because the project has zero external
dependencies (see "Why no dependencies" below). If you ever want to reset the
demo data back to its original seeded state:

```bash
node utils/seed.js
```

This overwrites `data/db.json` with a fresh set of categories, articles,
videos, audio clips, characters, merchandise, events, users, and chatbot FAQ
entries. Do this if the demo data gets messy during testing/marking.

Optional: copy `.env.example` to `.env` to change the port or session secret.
Neither is required to run the app.

## 3. Test / demo user credentials

| Role       | Email                    | Password   |
|------------|--------------------------|------------|
| Admin      | admin@fanhubplus.com     | Admin@123  |
| Registered | jordan@example.com       | Fan@1234   |
| Registered | sam@example.com          | Fan@1234   |

The admin account can reach the control panel at **/admin**.

## 4. Project structure

```
FanHub/
  core/          hand-built framework: HTTP router, sessions, JSON store,
                 password hashing, icons, art generation, page layout
  models/        thin collection wrappers over the JSON store
  middleware/    auth / role-guard middleware
  routes/        one file per feature area (auth, content, characters,
                 articles, merch, events, admin, api, dashboard, pages)
  views/         server-rendered pages, one JS module per page (returns
                 an HTML string — no template engine dependency)
  public/        css/js served as static files, zero build step
  data/db.json   the JSON "database" (see database/schema.sql for the
                 same model laid out relationally)
  utils/seed.js  regenerates data/db.json with demo content
  database/schema.sql   reference relational schema (entities, PK/FK)
```

## 5. Why no dependencies, and what that means for the SRS's tech list

The SRS interface requirements list several stacks (Java/Jakarta EE, C#/ASP.NET,
PHP/Laravel, Python/Flask or Django, or a MongoDB/Express/Node/React or Angular
combination) with a database of MySQL/SQL Server/MongoDB/**JSON**. This build
uses **Node.js + a hand-written micro framework + JSON**, which sits inside
that permitted list — JSON is explicitly named as an allowed database option,
and Node.js is one of the sanctioned backend runtimes (via the MERN/MEAN
option). The only difference from a typical submission is that Express itself
was swapped for a small first-party router (`core/femto.js`) because the npm
registry wasn't reachable while building — everything Express would have
given us (routing, sessions, body parsing, static files) is implemented
directly on Node's `http` module instead, in well under 300 lines.

If your evaluation environment has full internet access and you would rather
run this on Express, the swap is straightforward: `core/femto.js` exposes the
same `app.get/post`, `req.body`, `req.session`, `res.render` surface Express
provides, so `server.js` and the route files would need only minor edits.

## 6. Assumptions made

- **Email delivery**: there is no SMTP/email service wired up (out of scope
  without a real mail provider and credentials). "Forgot password" generates a
  real, expiring (30 minute) tokenized reset link exactly as the SRS asks for,
  but instead of emailing it, the link is shown directly on the confirmation
  screen — clearly labeled as demo behavior. The tokenized-link mechanism
  itself is fully real; only the transport (email vs. on-screen) is a stand-in.
- **AI chatbot**: implemented as a rule-based keyword-matching assistant
  (`core/chatbot.js`) rather than wired to a third-party AI/chat service
  (tawk.to, Zapier, etc., as suggested — the feature is explicitly optional in
  the SRS). This keeps the whole app dependency-free and keeps visitor
  messages from leaving the server. Its FAQ knowledge base is fully editable
  from the admin panel.
- **Media assets**: article, character, and merchandise artwork is generated
  programmatically as gradient "cover art" (`core/art.js`) rather than using
  real franchise images, and every anime/game/show/idol-group/comic featured
  in the seed data is original/fictional. The SRS specifically flags real
  fandom media as a licensing risk ("usage of fandom-related images, videos,
  audio clips... may be subject to licensing agreements and copyright
  restrictions"), so the seed content sidesteps that entirely rather than
  testing the line. Video/audio players use small open-source sample clips
  (Blender Foundation demo videos, SoundHelix demo audio) purely to
  demonstrate the multimedia player UI, and are labeled as demo assets in the
  UI.
- **Merchandise checkout**: out of scope per the SRS ("will not have any
  functionality for actual merchandise purchase, order processing, or payment
  gateways"). The merch section is discovery-only, as specified.
- **Map/GPS integration**: uses Leaflet.js with OpenStreetMap tiles (loaded
  from a public CDN in the visitor's browser at runtime — not part of the
  server's own dependency tree) plus the browser's Geolocation API for
  "use my location." No paid map API key is required.
- **Sessions**: kept in server memory rather than a session store, which is
  appropriate for a project of this size and means restarting the server logs
  everyone out (bookmarks/content/etc. persist in `data/db.json` regardless).

## 7. Feature checklist (maps to SRS §1.6)

- User auth: register/login/logout, forgot/reset password, editable profile
  (name, bio, favorite fandoms, avatar upload, theme, font size), password
  change — `routes/auth.js`
- Personalized dashboard: greeting, favorite-fandom content feed, bookmarks
  — `routes/dashboard.js`, `views/dashboard/`
- Fandom Content Explorer with search, category/type filters, and
  latest/popular/alphabetical sorting — `routes/content.js`, `/explore`
- AI-assisted chatbot (optional feature), with admin-editable FAQ knowledge
  base and logged conversations — `core/chatbot.js`, `/admin/chatbot`
- Interactive multimedia center: video/audio playback, 5-star ratings
  — `views/content/detail.js`
- Character profiles & featured articles hub, including event-highlight
  timeline and fan-content submission with admin approval — `routes/articles.js`
- Merchandise showcase & resource library: tags, upcoming releases, view
  counts — `routes/merch.js`
- Feedback with type categorization (bug/suggestion/query) — `routes/pages.js`
- Bookmarking with notes, across content/characters/merch — `routes/api.js`
- Location-aware event discovery & calendar: Leaflet map, city filter, "use my
  location" — `routes/events.js`, `views/events/list.js`
- Admin control panel: manage content (incl. approving/rejecting fan
  submissions), characters, merch, events, chatbot FAQ, feedback, and user
  roles, plus a usage-stats overview — `routes/admin.js`
- Accessibility/UI: dark mode toggle, font-size control, breadcrumbs, loading
  states, reveal-on-scroll transitions — `public/css/style.css`,
  `public/js/main.js`
- Sitemap linked from the home page footer, plus a dedicated `/sitemap` page

## 8. Database design

See `database/schema.sql` for the full entity list with primary/foreign keys
(users, categories, content, characters, merchandise_items, events,
bookmarks, feedback, chatbot_faq, chatbot_logs, plus the join tables for
favorite categories, ratings, and tags). The live app stores the same shapes
as arrays of plain objects in `data/db.json`.
