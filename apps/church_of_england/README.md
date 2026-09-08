# Church of England (`church_of_england`)

Museum-style public NFC site with a Westminster Abbey demo stop and dashboard scope `church_of_england`.

## Local dev

From monorepo root:

```bash
npm install
npm run dev:church-of-england
```

Copy `.env.example` to `.env.local` and set `VITE_API_PROXY_TARGET` plus `VITE_DASHBOARD_PASSWORD` (must match API `DASHBOARD_PASSWORD`). `/dashboard` is public — no login. Vite injects the API password on `/api` in local dev.

`/dashboard` is the church-only analytics dashboard (same tabs as Arkin). Church tags also remain on the main dashboard at `https://arkin.takemearound.gallery` (scope Church of England).

## Netlify

| Setting | Value |
|---------|--------|
| Base directory | `apps/church_of_england` |
| Publish directory | `dist` |

Public host in config: `takemearound.church`.
On Netlify, set `VITE_DASHBOARD_PASSWORD` (same value as the API) so `/dashboard` can load without a login. The browser never sees that password.
Canonical Southwell stop: `/minster_cathedral/Southwell/deans_welcome_message`.
Southwell uses the same visitor languages as gallery and museum (`?lang=fr` or the browser language): English, French, Japanese, Arabic, German, Spanish, Korean, Chinese, Portuguese, Turkish, Italian.
