# Arkin Museum (`arkin_museum`)

Same structure as `apps/museum` — public NFC site and embedded dashboard scope for museum analytics.

## Local dev

From monorepo root (`TMA_frontend`):

```bash
npm install
npm run dev:arkin-museum
```

Copy `.env` from `apps/museum` if needed (`VITE_API_PROXY_TARGET`, `VITE_ARKIN_DASHBOARD_URL`).

## Netlify

| Setting | Value |
|---------|--------|
| Base directory | `apps/arkin_museum` |
| Publish directory | `dist` |

Build command is defined in `netlify.toml` (workspace build from repo root).
