# Personal Website — Web (Landing page)

Public landing page for the Personal Website project. Built with Next.js (App
Router) and Tailwind CSS v4. All content is authored in
`Personal-website-admin` and served by `Personal-website-api`.

This is a **single-page site**: every section lives on `/` and navigation uses
anchors. There are no other routes.

## Getting started

Requires the API to be running (default `http://localhost:3001`).

```bash
cp .env.example .env.local   # then adjust NEXT_PUBLIC_BACKEND_URL if needed
npm install
npm run dev
```

Open http://localhost:3000/personal-website — note the `/personal-website`
`basePath` configured in `next.config.ts`.

## Environment

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_BACKEND_URL` | yes | API base URL used by the browser, baked in at build time. Must include the `/personal-website/api/` prefix and a trailing slash. |
| `BACKEND_INTERNAL_URL` | no | API base URL used during server rendering, for when the API is reachable at a different address than the browser uses (e.g. a Docker service name). Falls back to `NEXT_PUBLIC_BACKEND_URL`. |

## Scripts

```bash
npm run dev         # development server
npm run build       # production build (output: standalone)
npm run start       # serve the production build
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
```

## How content reaches the page

`app/page.tsx` renders on the server and makes a single request:

```
GET {NEXT_PUBLIC_BACKEND_URL}public/content
```

The API returns the `site_settings.show_*` flags plus only the sections that
are enabled, already filtered to `deleted_at IS NULL AND is_active = TRUE` and
ordered by `display_order`. A section is rendered when its flag is on *and* it
has content, so toggling a section off in the admin removes it from the page
and from the navigation.

Sections, in page order: banners (hero), about, skills, projects, experiences,
education, contact.

The page also sends `POST website-visits/track` once per browser session.

## Language

Thai and English, selected with the header switcher and stored in the
`personal_website_locale` cookie. UI strings live in `app/messages/{en,th}/main.json`;
content uses the API's paired `*_th` / `*_en` fields with fallback to the other
language when one is blank.

## Docker

```bash
NEXT_PUBLIC_BACKEND_URL=https://example.com/personal-website/api/ \
  docker compose up -d --build personal-website-web
```

Serves on `${WEB_PORT:-3008}` → `http://localhost:3008/personal-website`.

## Conventions

See [AGENTS.md](./AGENTS.md) for folder layout, server/client component rules,
and the checklist to run before finishing a change.
