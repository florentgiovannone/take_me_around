# Take Me Around — monorepo

Four public frontends and one shared analytics dashboard, plus the Flask API in `Backend/`.

## Layout

```
apps/
  gallery/            → takemearound.gallery
  museum/             → takemearound.museum
  arkin_museum/       → clone of museum (separate Netlify site / domain)
  church_of_england/  → takemearound.church (Westminster Abbey + Southwell Minster)
  dashboard/          → arkin.takemearound.gallery (combined + per-site analytics)
packages/
  config/                        Site scope types and labels
  analytics-gallery/             Gallery-specific analytics helpers
  analytics-museum/              Museum-specific analytics helpers
  analytics-church-of-england/   Church of England analytics helpers
  dashboard-scope/               Scoped API for dashboard UI (per site or combined)
  dashboard-ui/                  Shared dashboard panels, hooks, charts, formatters
Backend/                         API (unchanged location)
```

Gallery and museum apps import dashboard UI from `@tma/dashboard-ui` and scope data from `@tma/dashboard-scope`. The Church of England app redirects `/dashboard` to the Arkin dashboard CoE scope. The Arkin dashboard uses the same packages with a site-scope dropdown.

## Commands (from repo root)

```bash
npm install
npm run dev:gallery      # or dev:museum, dev:arkin-museum, dev:church-of-england, dev:dashboard
npm run build            # all apps
npm run build:gallery    # single app (also build:museum, build:church-of-england, etc.)
```

## Netlify (one repo, four public sites + dashboard)

Set **Base directory** per site (or leave Base empty and set **Package directory** — see Church of England note):

| Site | Base directory | Publish directory |
|------|----------------|-------------------|
| Gallery | `apps/gallery` | `dist` |
| Museum | `apps/museum` | `dist` |
| Arkin Museum | `apps/arkin_museum` | `dist` |
| Church of England | *(empty)* + Package directory `apps/church_of_england` | `apps/church_of_england/dist` |
| Arkin dashboard | `apps/dashboard` | `dist` |

Most apps’ `netlify.toml` run `cd ../.. && npm ci && npm run build -w @tma/app-*` with Base = `apps/<app>`. CoE installs from the git root and publishes `apps/church_of_england/dist` so it works when Netlify’s cwd is the repo root. Path-based `ignore` skips deploys when unrelated folders change.

Gallery, museum, and church of England redirect `/dashboard` to the Arkin dashboard (see each app’s Vite `netlify-redirects` plugin).

## Environment

Per app, copy `.env.example` to `.env` and set:

- `VITE_API_PROXY_TARGET` — Flask/ngrok URL for local dev and Netlify API proxy
- `VITE_ARKIN_DASHBOARD_URL` — Arkin dashboard URL (gallery/museum/church of England redirects)

Dashboard-only: `VITE_DASHBOARD_OPERATOR_ID` (optional default operator).
