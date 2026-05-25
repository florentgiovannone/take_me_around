# TMA Main Dashboard

Password-protected analytics for **takemearound.gallery**, **takemearound.museum**, or **combined** (both sites).

Deployed at `https://arkin.takemearound.gallery`.

## Features

- Single dashboard with a **site scope** dropdown (Gallery / Museum / Combined).
- **Operator profiles** (`src/config/operators.ts`) control which scopes each user may see.
- Same tabs as the per-site dashboards: Activity, Link scan counts, Overview, Audience, Live sessions.

## Local dev

```bash
cd apps/dashboard   # or from repo root: npm run dev:dashboard
cp .env.example .env
# Edit .env — set VITE_API_PROXY_TARGET to your Flask/ngrok URL
npm install
npm run dev
```

Open `http://localhost:5173`. Use the same dashboard password as gallery/museum (`DASHBOARD_PASSWORD` on the API).

### Operator profiles (phase 2)

Edit `src/config/operators.ts` to add or change operators. Each operator has an `id`, `name`, and `sites` array.

- One site → only that site in the dropdown.
- Two or more sites → those sites plus **Combined**.

When more than one operator exists, a **profile picker** appears on the login form. The chosen profile is stored in the session.

Optional build-time default (skips login picker behaviour for restores):

```env
VITE_DASHBOARD_OPERATOR_ID=museum-only
```

## Routes

| Path | Behaviour |
|------|-----------|
| `/` | Full dashboard with scope switcher |
| `/dashboard` | Locked to `.gallery` |
| `/dashboard/museum` | Locked to `.museum` |

## Deploy (Netlify)

1. Netlify site for this folder: `npm run build`, publish `dist`.
2. Build env: `VITE_API_PROXY_TARGET` = production API URL.
3. Optional: `VITE_DASHBOARD_OPERATOR_ID` for a fixed operator on that deploy.
4. Backend CORS: `Backend/app.py` includes this origin.

## API

`GET /api/secure/items` with header `X-Dashboard-Password`. Scope filtering is client-side in `src/utils/siteDashboard.ts`.
