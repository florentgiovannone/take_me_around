# Church in-app dashboard — design

**Date:** 2026-08-25  
**Status:** Approved for planning  
**Approach:** Port Arkin’s in-app dashboard into `apps/church_of_england`; keep church in the main analytics switcher

## Goal

Give `takemearound.church` its own password-protected analytics dashboard at `/dashboard`, the same way Arkin hosts a dashboard on its public site, while church tags remain available in the main dashboard (`arkin.takemearound.gallery`) site switcher and Combined view.

## Decisions

| Topic | Choice |
|-------|--------|
| Pattern | Arkin in-app dashboard (not gallery/museum off-site redirect) |
| Host | `takemearound.church/dashboard` |
| Scope lock | `SiteScopeProvider` with `church_of_england` |
| Tracked tags | Westminster Abbey, Southwell Minster (existing analytics package) |
| Main dashboard | Unchanged; church stays pickable and in Combined |
| Locked main-host route | Keep `/dashboard/church-of-england` (no rename, no dual `/dashboard/church`) |
| Shared dashboard shell | Do not extract a package; copy Arkin’s page into the church app |
| Subtitle | Live .church activity |
| Header/footer | Church `tma-header` + existing `Footer` (no Rodin chrome) |
| Session key | `tma-dashboard-password-church` |
| Local password | `VITE_DASHBOARD_PASSWORD` wins over session (Arkin behaviour) |
| API header | `X-Dashboard-Password` only; do not send `X-Dashboard-App: arkin` |
| Automated tests | None (build + manual smoke, same as original church app) |

## Out of scope

- Backend / Flask API changes
- New analytics package or new tracked artworks
- Extracting a shared in-app dashboard used by Arkin and church
- Renaming main-dashboard path to `/dashboard/church`
- Changing main-dashboard labels from “Church of England” to `.church`
- Operator-profile or settings changes on the main dashboard
- Hosting the church dashboard as a separate Netlify site

## Architecture

```
apps/church_of_england/src/pages/Dashboard.tsx   # Arkin-shaped in-app dashboard
apps/church_of_england/src/apiBaseUrl.ts         # same-origin /api vs direct base
apps/church_of_england/src/parseApiJson.ts       # reject SPA HTML masquerading as JSON
apps/church_of_england/src/App.tsx               # /dashboard → Dashboard page
apps/church_of_england/vite.config.ts            # drop /dashboard 301; add package aliases
packages/analytics-church-of-england             # unchanged filter for the two tags
apps/dashboard                                   # unchanged main switcher + locked route
```

Church `/dashboard` currently redirects (React `ExternalDashboardRedirect` + Netlify `_redirects` 301) to `https://arkin.takemearound.gallery/dashboard/church-of-england`. Both redirects go away so the SPA can serve the page.

The church app already depends on `@tma/dashboard-ui` and `@tma/dashboard-scope`. Vite must alias those packages the same way Arkin does, or the dashboard page will not resolve them at build time.

## Pages and components

### Church site

| Path | Behaviour |
|------|-----------|
| `/dashboard` | In-app dashboard (password gate, then analytics) |
| All other church routes | Unchanged |

The dashboard page is a port of `apps/arkin_museum/src/pages/Dashboard.tsx`:

- Password form until authorized
- Tabs: Activity, Link scan counts, Overview, Audience, Live sessions
- Poll `GET /api/secure/items` every 5 seconds after login
- Panels from `@tma/dashboard-ui`, wrapped in `SiteScopeProvider scope="church_of_england"`
- Log out clears the church session key and returns to the form

Chrome: `tma-header` with title “Dashboard” and subtitle “Live .church activity”, plus the existing church `Footer`. Do not import Arkin’s `RodinSiteHeader` or Rodin CSS.

Remove `ExternalDashboardRedirect` once nothing else uses it.

### Main dashboard

No code changes. Church remains in `PICKABLE_SITE_IDS`, the default operator, the church-only operator, and `/dashboard/church-of-england`.

## Data flow

1. Browser calls `GET /api/secure/items` with `X-Dashboard-Password`.
2. Locally, Vite proxies `/api` using `VITE_API_PROXY_TARGET` from `apps/church_of_england/.env.local`.
3. In production, Netlify `_redirects` maps `/api/*` to that same backend origin (already required for other church needs).
4. The API returns all poise logs. Client-side `church_of_england` scope keeps only Westminster Abbey and Southwell Minster (canonical paths plus existing aliases).
5. The main dashboard continues to fetch independently. Sessions are not shared across hosts.

`apiBaseUrl` follows Arkin: deployed/local-with-proxy use same-origin `/api/...`; otherwise use `VITE_API_BASE_URL`. The church helper’s deployed-host list must include `takemearound.church` and `www.takemearound.church` (and Netlify preview hosts if Arkin includes them). Send `ngrok-skip-browser-warning` when talking through the proxy or a ngrok URL.

## Error handling

| Condition | Behaviour |
|-----------|-----------|
| 401 | Stay on login; “Incorrect password.”; clear saved session |
| 404 | “API not reachable…” message (Arkin copy) |
| 503 | “Server is not configured for secure access.” |
| HTML instead of JSON | Explain Netlify `/api` proxy is missing |
| Network error before login | Show on the form |
| Network error during poll | Show dashboard error; do not log the user out |
| 401 during poll | Treat as unauthorized; clear session |
| No church scans | Existing empty copy from `@tma/analytics-church-of-england` |

Logout always clears `tma-dashboard-password-church`.

## Testing

No new unit tests. Verification:

1. `npm run build -w @tma/app-church-of-england` succeeds.
2. `npm run dev:church-of-england`: `/dashboard` stays on the church origin (no redirect to Arkin). Login with `VITE_DASHBOARD_PASSWORD`.
3. Only Westminster Abbey and Southwell Minster scans appear. All five tabs render. Logout returns to the password form.
4. Wrong password shows the 401 message.
5. Public church pages still work (`/`, `/westminster-abbey`, Southwell path).
6. Main dashboard still lists Church of England in the switcher and Combined.

## File touch list (implementation)

Create:

- `apps/church_of_england/src/pages/Dashboard.tsx`
- `apps/church_of_england/src/apiBaseUrl.ts`
- `apps/church_of_england/src/parseApiJson.ts`

Modify:

- `apps/church_of_england/src/App.tsx` — route `/dashboard` to the page
- `apps/church_of_england/vite.config.ts` — remove `/dashboard` 301s and `VITE_ARKIN_DASHBOARD_URL`; add Arkin-style `@tma/*` resolve aliases
- `apps/church_of_england/src/vite-env.d.ts` — `VITE_DASHBOARD_PASSWORD`
- `apps/church_of_england/.env.example` — document `VITE_DASHBOARD_PASSWORD`; remove `VITE_ARKIN_DASHBOARD_URL`
- `apps/church_of_england/netlify.toml` — comment that `/dashboard` is in-app, not a 301
- `apps/church_of_england/README.md` — dashboard is local to the church site

Delete:

- `apps/church_of_england/src/components/ExternalDashboardRedirect.tsx` (if unused after the route change)
