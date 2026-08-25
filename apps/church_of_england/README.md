# Church of England (`church_of_england`)

Museum-style public NFC site with a Westminster Abbey demo stop and dashboard scope `church_of_england`.

## Local dev

From monorepo root:

```bash
npm install
npm run dev:church-of-england
```

Copy `.env.example` to `.env.local` and set `VITE_API_PROXY_TARGET`. Optional: `VITE_DASHBOARD_PASSWORD` to auto-unlock `/dashboard` in local dev — it must match the API `DASHBOARD_PASSWORD` (same value as the main dashboard), not a church-only string.

`/dashboard` is the church-only analytics dashboard (same tabs as Arkin). Church tags also remain on the main dashboard at `https://arkin.takemearound.gallery` (scope Church of England).

## Netlify

| Setting | Value |
|---------|--------|
| Base directory | `apps/church_of_england` |
| Publish directory | `dist` |

Public host in config: `takemearound.church`.
Canonical Southwell stop: `/minster_cathedral/Southwell/deans_welcome_message`.
