# ZOR Professional — website

Premium, **no-scroll "deck"** website for ZOR Professional (Croatian toilet-paper manufacturer/supplier). The public site behaves like an interactive presentation — each screen is one slide, navigation moves between chapters and slides — and is backed by Supabase for content, leads, and a lightweight admin panel. When Supabase is not configured, the site runs fully on local fallback content.

---

## What this project is

- **No-scroll deck UI** — public pages are full-screen slides (`DeckShell` / `DeckSlide` / `DeckControls` / `SlideIndicator`), not long scrolling pages. See [DECK_ARCHITECTURE.md](DECK_ARCHITECTURE.md).
- **Bilingual** — Croatian (`/hr`) and English (`/en`) mirrors.
- **Supabase-backed, fallback-safe** — chapters, slides, products, blog, careers, leads, and site settings come from Supabase when configured; otherwise from `src/content/*`. See [SUPABASE_USAGE.md](SUPABASE_USAGE.md).
- **Admin panel** at `/admin` — manage all content, review leads/applications, edit site settings, upload images. See [ADMIN_NOTES.md](ADMIN_NOTES.md).
- **Lead capture** — contact, product, calculator, and career inquiries via `/api/leads` and `/api/career-applications`, with WhatsApp/email fallback.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 |
| Backend | Supabase (Postgres + Auth + Storage, RLS) |
| Icons | lucide-react |
| E2E tests | Playwright |

---

## Getting started

Requires **Node.js 20.9+**.

```bash
npm install
npm run dev
```

Open http://localhost:3000 — the root redirects to `/hr`.

> On Windows PowerShell, if script policy blocks `npm`, use `npm.cmd run dev`.

### Environment variables

Supabase is **optional** for local development. Without env vars the site uses local fallback content and forms show a fallback message.

Create `.env.local` to connect Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyxxxxx
```

Never put the service-role key in the frontend — only the public anon key.

### NPM scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build + TypeScript check |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (flat config) |
| `npm run test:e2e` | Playwright e2e (boots `next dev`, runs chromium + mobile-chrome) |
| `npm run test:e2e:ui` | Playwright UI mode |

---

## Project structure

```
src/
├── app/                 # App Router routes (/hr, /en, /admin, /api/*) + root layout
├── components/
│   ├── deck/            # Deck shell, slides, controls, interactive cards, visuals
│   ├── admin/           # AdminPanel + AdminLogin
│   └── SiteSettingsProvider.tsx
├── content/             # Static fallback content (deck, products, blog, site, home)
├── lib/
│   ├── data/            # Supabase ↔ fallback data helpers (deck, products, blog, careers, leads, settings)
│   ├── supabase/        # client / server / types
│   └── utils.ts
supabase/migrations/     # SQL: tables, RLS, storage buckets, seed data
tests/e2e/               # Playwright specs
scripts/                 # dev utilities (e.g. slide-audit, e2e runner)
```

### Content & fallback model

Every data helper in `src/lib/data/*` tries Supabase first and falls back to `src/content/*` on missing env or query error, so local dev never breaks without a database. Public routes are **code-owned**: a `route_path` in `deck_chapters` must match an existing route in the app. Details in [CONTENT_STRUCTURE.md](CONTENT_STRUCTURE.md) and [SUPABASE_USAGE.md](SUPABASE_USAGE.md).

Public contact values (WhatsApp number, email, shop URL, …) resolve from the `site_settings` table via `getSiteContact()` and are shared with client components through `SiteSettingsProvider`; they fall back to `src/content/site.ts`.

---

## Connecting Supabase (one-time)

1. Create a Supabase project → SQL Editor → paste and run `supabase/migrations/20260615130000_zor_backend.sql`.
2. Confirm the 9 tables and 4 storage buckets (`deck-images`, `product-images`, `blog-images`, `career-cv`) exist.
3. Create the first admin: Authentication → add a user → copy `auth.users.id` → add a row in `profiles` with that id and `role = admin`.
4. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local` (local) and to the hosting env (production).
5. Run `npm run dev`, open `/admin/login`, sign in, and confirm CRUD works.

The step-by-step checklist also lives in [PLAN.md](PLAN.md).

## Admin panel

- Route: `/admin` (protected by Supabase Auth; unauthenticated users go to `/admin/login`).
- Roles: `viewer` (read-only), `editor` (manage content/leads/careers), `admin` (everything + site settings).
- Manage deck chapters & slides, products, blog posts, leads, career positions & applications, and site settings.
- Image uploads (deck/product/blog) go straight to the matching Supabase Storage bucket and write the public URL into the record.

Full operating guide: [ADMIN_NOTES.md](ADMIN_NOTES.md).

---

## Testing & quality

Run before pushing or deploying:

```bash
npm run lint
npm run build
npm run test:e2e
```

E2E runs against `next dev` in fallback mode (no Supabase), covering deck navigation, no-scroll behavior, mobile bottom nav, the blog reader, contact-form fallback, and admin protection. The Playwright config sets `retries` because the dev server can throw transient SSR errors under parallel workers.

## Deployment

Deploy on Vercel (or any Next.js host):

1. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the host's environment.
2. Build command `next build`, output is the standard Next.js app.
3. Public deck pages are statically prerendered; after changing content/settings in Supabase, redeploy or revalidate to refresh the prerendered pages. `/admin` is always dynamic.

---

## Documentation index

| Doc | Topic |
| --- | --- |
| [PROJECT_BRIEF.md](PROJECT_BRIEF.md) | Product brief and goals |
| [DECK_ARCHITECTURE.md](DECK_ARCHITECTURE.md) | No-scroll deck: chapters, slides, routing, a11y |
| [CONTENT_STRUCTURE.md](CONTENT_STRUCTURE.md) | Chapter/slide content model |
| [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | Visual/design system |
| [SUPABASE_USAGE.md](SUPABASE_USAGE.md) | Supabase backend: schema, RLS, helpers, editing content |
| [ADMIN_NOTES.md](ADMIN_NOTES.md) | Admin panel operating guide |
| [PLAN.md](PLAN.md) | Current status, audit findings, roadmap, connect-later checklist |

## Status & roadmap

Done: deck refactor, Supabase backend, admin panel, image uploads, `site_settings` wired into the public UI.
Next: CV upload (private bucket), production readiness (SEO/sitemap/robots), in-app user management. See [PLAN.md](PLAN.md).
