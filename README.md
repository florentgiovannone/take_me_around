# Take Me Around — monorepo

Three public frontends and one shared analytics dashboard, plus the Flask API in `Backend/`.

## Layout

```
apps/
  gallery/     → takemearound.gallery
  museum/      → takemearound.museum
  dashboard/   → arkin.takemearound.gallery (combined + per-site analytics)
packages/
  config/              Site scope types and labels
  analytics-gallery/   Gallery-specific analytics helpers
  analytics-museum/    Museum-specific analytics helpers
  dashboard-scope/     Scoped API for dashboard UI (per site or combined)
  dashboard-ui/        Shared dashboard panels, hooks, charts, formatters
Backend/               API (unchanged location)
```

Gallery and museum apps import dashboard UI from `@tma/dashboard-ui` and scope data from `@tma/dashboard-scope`. The Arkin dashboard uses the same packages with a site-scope dropdown.

## Commands (from repo root)

```bash
npm install
npm run dev:gallery      # or dev:museum, dev:dashboard
npm run build            # all three apps
npm run build:gallery    # single app
```

## Netlify (one repo, three sites)

Set **Base directory** per site:

| Site | Base directory | Publish directory |
|------|----------------|-------------------|
| Gallery | `apps/gallery` | `dist` |
| Museum | `apps/museum` | `dist` |
| Arkin dashboard | `apps/dashboard` | `dist` |

Each app’s `netlify.toml` runs `cd ../.. && npm ci && npm run build -w @tma/app-*` so workspace packages are built. Path-based `ignore` skips deploys when unrelated folders change.

Gallery and museum redirect `/dashboard` to the Arkin dashboard (see each app’s Vite `netlify-redirects` plugin).

## Environment

Per app, copy `.env.example` to `.env` and set:

- `VITE_API_PROXY_TARGET` — Flask/ngrok URL for local dev and Netlify API proxy
- `VITE_ARKIN_DASHBOARD_URL` — Arkin dashboard URL (gallery/museum redirects)

Dashboard-only: `VITE_DASHBOARD_OPERATOR_ID` (optional default operator).
# Take_me_around
# take_me_around
# take_me_around
