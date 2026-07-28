# Final review fix evidence

- Analytics red: `node packages/analytics-church-of-england/smoke.mjs` initially failed on the opaque SEEN payload containing `HTTP_REFERER: https://google.com/...`.
- Analytics green: the same smoke passes all 5 requested cases.
- Domain behavior: path extraction retains the strict Church of England host gate; title fallback now permits opaque JSON/environ payloads while rejecting link-shaped foreign messages and tracked museum/gallery/Arkin hosts.
- Dashboard reset: `DashboardSettingsPage` now resets from `PICKABLE_SITE_IDS`, including `church_of_england`.
- Static checks: edited files report no linter errors.
- Build: `npm run build` completed successfully for all five applications.
