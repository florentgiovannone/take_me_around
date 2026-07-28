# Church of England (`church_of_england`)

Museum-style public NFC site with a Westminster Abbey demo stop and dashboard scope `church_of_england`.

## Local dev

From monorepo root:

```bash
npm install
npm run dev:church-of-england
```

Copy `.env.example` to `.env` and set `VITE_API_PROXY_TARGET`, `VITE_ARKIN_DASHBOARD_URL` if needed.

## Netlify

| Setting | Value |
|---------|--------|
| Base directory | `apps/church_of_england` |
| Publish directory | `dist` |

Provisional public host in config: `church.takemearound.gallery`.
