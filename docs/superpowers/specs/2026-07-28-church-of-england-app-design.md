# Church of England app — design

**Date:** 2026-07-28  
**Status:** Approved for planning  
**Approach:** Lean museum clone + new analytics package

## Goal

Add a new public NFC frontend `apps/church_of_england` (`@tma/app-church-of-england`) to the Take Me Around monorepo, following the museum site pattern, with one demo stop (Westminster Abbey) and full site-scope analytics integration in the shared Arkin dashboard.

## Decisions

| Topic | Choice |
|-------|--------|
| Base pattern | Museum / Arkin public-site shell (not gallery, not empty Vite-only) |
| Content for v1 | Structural clone + one demo stop with placeholders |
| Folder / package name | `church_of_england` / `@tma/app-church-of-england` (corrected spelling) |
| Demo stop | Westminster Abbey at `/westminster-abbey` |
| Dashboard / analytics | Full: new `SiteId`, analytics package, dashboard-scope wiring, fixed dashboard route |
| Languages | English-only placeholders for v1 |
| Host (provisional) | `church.takemearound.gallery` in `SITE_META` until the real domain is known |

## Out of scope (v1)

- Real Church of England copy, photography, or production audio
- Multi-locale translation / ElevenLabs generation scripts
- Backend / Flask API changes
- Generalizing shared analytics into one host-driven package (deferred)
- Automated test suite for the new app

## Architecture

```
apps/church_of_england/          # new public Vite + React app
packages/config/                 # SiteId += church_of_england
packages/analytics-church-of-england/  # museum-shaped analytics for CoE host/tags
packages/dashboard-scope/        # branch on church_of_england scope
apps/dashboard/                  # /dashboard/church-of-england route
```

Root `package.json` gains:

- `dev:church-of-england`
- `build:church-of-england`
- inclusion in the aggregate `build` script

Netlify: base directory `apps/church_of_england`, publish `dist`, `netlify.toml` workspace build (`npm run build -w @tma/app-church-of-england`), path-based `ignore` covering `apps/church_of_england` and `packages`.

## App pages & components

### Routes

| Path | Purpose |
|------|---------|
| `/` | Home shell (Take Me Around branding, museum-style) |
| `/westminster-abbey` | Demo stop page |
| `/allpages` | Dev index of available pages |
| `/underlying-technology` | Static page (museum shell) |
| `/contact` | Contact page |
| `/privacy-policy` | Privacy policy |
| `/dashboard` | Redirect to Arkin dashboard `/dashboard/church-of-england` |
| `*` | Not found |

### Westminster Abbey stop

Layout matches a museum artwork page:

- Header with title / subtitle
- Banner link to underlying technology
- Optional `AudioPlayer` when an audio asset exists
- Image (local placeholder asset required so the page never breaks)
- Short English placeholder sections
- Footer

English-only for v1 (no locale detection matrix).

### Shared shell pieces

Keep museum-style: `AudioPlayer`, `Footer`, `ExternalDashboardRedirect`, shared CSS patterns. Do not copy museum artwork pages, Rodin assets, or Arkin maintenance mode.

## Data flow & analytics

### `@tma/config`

- Extend `SiteId` with `"church_of_england"`
- Add `SITE_META` entry: `label: "Church of England"`, `domainLabel: "Church of England"`, `host: "church.takemearound.gallery"` (provisional)
- Include in `ALL_SITE_IDS` and `PICKABLE_SITE_IDS`

### `@tma/analytics-church-of-england`

- Same public helper surface as `@tma/analytics-museum` so `@tma/dashboard-scope` can call it consistently
- Tracked stops: only `{ title: "Westminster Abbey", path: "/westminster-abbey" }`
- Domain filter uses the CoE provisional host (reject gallery / museum / arkin hosts)

### `@tma/dashboard-scope`

- Depend on the new analytics package
- Branch `scope === "church_of_england"` (and combined aggregation when the site is enabled) the same way as museum / gallery / arkin

### Dashboard app

- Route `/dashboard/church-of-england` → `Dashboard` with `fixedScope="church_of_england"`
- Settings site list discovers the new id via config
- CoE app `/dashboard` redirects to that fixed path

### Environment

App `.env.example`:

- `VITE_API_PROXY_TARGET`
- `VITE_ARKIN_DASHBOARD_URL`

## Errors & empty states

- Unknown routes → Not Found page
- Missing audio → omit `AudioPlayer`
- Missing image → prevented by shipping a placeholder asset
- No matching analytics logs → existing dashboard empty charts/tables behavior

## Verification

- `npm run build -w @tma/app-church-of-england` succeeds
- `npm run build -w @tma/app-dashboard` succeeds with new scope/route
- Manual smoke: home, `/westminster-abbey`, `/allpages`, `/dashboard` redirect, 404
- Update root README Netlify table + short `apps/church_of_england/README.md`

## Implementation notes

1. Prefer scaffolding from museum shell and stripping artworks over copying all of `arkin_museum` (avoids Rodin/maintenance leftovers).
2. Analytics package may be large (museum-sized); acceptable for v1 to match the existing three-package pattern.
3. Provisional host string must be consistent across `SITE_META`, analytics domain filters, and docs so it can be renamed in one pass later.
