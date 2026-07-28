# Temple of Dendur stop page — design

**Date:** 2026-07-28  
**Status:** Approved for implementation  
**App:** `apps/church_of_england`  
**Approach:** Same as Southwell Minster — React port + scoped CSS + TMA chrome

## Goal

Add `/the-temple-of-dendur` to the Church of England app by porting `temple-of-dendur` source into React with full TMA stop chrome and analytics tracking.

## Decisions

| Topic | Choice |
|-------|--------|
| App | `church_of_england` |
| Route | `/the-temple-of-dendur` |
| Chrome | TMA banners, optional AudioPlayer, shared Footer |
| Analytics | Track alongside existing CoE stops |
| Editor toolbar | Omit (visitor page, not the source’s edit/print UI) |

## Files

- `src/pages/TempleOfDendurPage.tsx`
- `src/styles/temple-of-dendur.css` (scoped under `.temple-of-dendur`)
- `src/assets/church-of-england/images/temple-of-dendur/temple-of-dendur.jpg`
- `App.tsx` route + `/allpages`
- `TRACKED_CHURCH_OF_ENGLAND_ARTWORKS` += Dendur
