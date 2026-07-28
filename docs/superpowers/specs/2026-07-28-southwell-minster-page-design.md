# Southwell Minster stop page — design

**Date:** 2026-07-28  
**Status:** Approved for planning  
**App:** `apps/church_of_england`  
**Approach:** React port of source HTML + scoped CSS + TMA stop chrome

## Goal

Add a `/southwell-minster` stop page to the Church of England app by porting the standalone Southwell Minster visitor guide (`southwell-minster-source`) into React, wrapping it with full museum-style Take Me Around chrome, and tracking it in CoE analytics alongside Westminster Abbey.

## Decisions

| Topic | Choice |
|-------|--------|
| Placement | New route `/southwell-minster` (alongside Westminster Abbey) |
| Visual | Faithful port of source design (cream paper, Cormorant Garamond + Inter, sanctuary red accent) |
| TMA chrome | Full museum-style shell: underlying-technology banners, optional AudioPlayer, shared TMA Footer |
| Analytics | Track `{ title: "Southwell Minster", path: "/southwell-minster" }` in addition to Westminster Abbey |
| Source | `/Users/florentgiovannone/Downloads/southwell-minster-source` (index.html + 5 JPEGs) |

## Out of scope

- Replacing Westminster Abbey or making Southwell the home page
- Producing audio for the stop
- Backend / Netlify domain changes
- Rewriting or modernising source copy beyond structural React conversion

## Architecture

```
apps/church_of_england/
  src/pages/SouthwellMinsterPage.tsx
  src/styles/southwell-minster.css          # scoped under .southwell-minster
  src/assets/church-of-england/images/southwell/
    west-front.jpg, west-window.jpg, leaves.jpg, organ.jpg, choir.jpg
packages/analytics-church-of-england/
  TRACKED_CHURCH_OF_ENGLAND_ARTWORKS += Southwell Minster
```

Root class `.southwell-minster` wraps the ported content so source CSS does not leak into global TMA styles. Hero background uses the imported west-front asset (CSS custom property or inline style), not a relative `images/` path.

## Page layout

Top → bottom:

1. TMA banner link → `/underlying-technology`
2. Optional `AudioPlayer` when `getStopAudio("southwell-minster")` is non-null (v1: null)
3. Ported hero + sticky in-page nav (`#history`, `#treasures`, `#officers`, `#music`, `#worship`, `#visit`, `#contact`)
4. Ported sections (history/timeline, treasures, officers, music, liturgy/services, hours, contact)
5. Ported dark colophon footer (credits / photo attribution)
6. TMA banner link → `/underlying-technology`
7. Shared TMA `Footer` (support@takemearound.com)

## App wiring

- `App.tsx`: route, `PAGE_TITLES["/southwell-minster"] = "Southwell Minster"`, `/allpages` link
- Document title: `Southwell Minster | Take Me Around`
- Google Fonts: Cormorant Garamond + Inter (as in source)

## Analytics

Extend:

```ts
export const TRACKED_CHURCH_OF_ENGLAND_ARTWORKS = [
  { title: "Westminster Abbey", path: "/westminster-abbey" },
  { title: "Southwell Minster", path: "/southwell-minster" },
]
```

No other analytics API changes required; existing helpers derive from this list.

## Verification

- `npm run build -w @tma/app-church-of-england` succeeds
- Manual smoke: `/southwell-minster` shows hero, sections, images; sticky anchors scroll; TMA banners + footer present; no audio player; `/allpages` lists the stop

## Implementation notes

1. Prefer a mechanical HTML→JSX conversion of the source body; keep copy and structure intact.
2. Scope every source selector under `.southwell-minster` (including `body`/`main`/`footer`/`nav` rules rewritten as descendants).
3. Do not use an iframe or `dangerouslySetInnerHTML` for the full page.
