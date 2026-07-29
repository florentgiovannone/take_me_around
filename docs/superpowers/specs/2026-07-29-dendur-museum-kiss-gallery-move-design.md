# Dendur → museum, Kiss → gallery (move + full i18n)

**Date:** 2026-07-29  
**Status:** Implemented  
**Approach:** Lift-and-port custom pages; remove from CoE; full museum/gallery locale parity

## Goal

Move **The Temple of Dendur** from Church of England into **`apps/museum`**, and **Klimt’s The Kiss** into **`apps/gallery`**. Remove both from CoE. Keep the current custom layouts and **per-section** audio players. Add **full locale parity** with other museum/gallery artworks: translated page copy + section audio for every supported language.

## Decisions

| Topic | Choice |
|-------|--------|
| Dendur destination | `apps/museum`, route `/the-temple-of-dendur` |
| Kiss destination | `apps/gallery`, route `/the-kiss` |
| CoE | Remove pages, routes, `/allpages` links, assets, section-audio entries, analytics entries |
| Layout | Keep current custom Met / Belvedere essay UIs + scoped CSS |
| Audio UX | Per-section players above each `h2` (intro above lede); speak heading then body |
| Languages | Full set: `en`, `fr`, `ja`, `ar`, `de`, `es`, `ko`, `zh`, `pt`, `tr`, `it` |
| Locale detection | Same as museum/gallery: `?lang=` + browser fallback via `detectArtworkPageLocale` |
| Page copy | Extract EN strings → data modules; DeepL-translate to locale modules (museum/gallery pattern) |
| Section audio | Generate EN, translate section scripts, ElevenLabs TTS per locale/voice |
| Page-level single player | Not used on these two pages |

## Scope

### In

- Port Dendur page, CSS, hero image into museum
- Port Kiss page, CSS, image into gallery
- `SectionAudio` + `getSectionAudio(workSlug, sectionId, locale)` in each destination app
- EN section scripts (from CoE) + translated scripts + MP3s under `audio/{locale}/{work}/{section}.mp3`
- Wire routes, `PAGE_TITLES`, `/allpages`
- Track in `@tma/analytics-museum` / `@tma/analytics-gallery`
- Strip Dendur and Kiss completely from CoE (including CoE section-audio config and EN mp3s for those works)
- npm scripts for translate + section-audio generation (adapt museum tooling)

### Out

- Shared cross-app package for these pages
- Restyling into the plain `tma-gallery-page` shell
- Keeping Dendur/Kiss on CoE
- Translating CoE Westminster / Southwell in this work

## Architecture

### Page copy

- English source of truth: structured copy objects (title, facts, lede, sections with `id`, `heading`, body paragraphs / lists as needed, banners, colophon).
- Locale files: `data/templeOfDendur.{locale}.ts`, `data/theKiss.{locale}.ts` (or equivalent museum/gallery naming).
- Page components resolve `locale` from search params and render only from copy (no hardcoded English JSX strings beyond structural markup).
- RTL: apply existing museum/gallery `dir` / locale conventions for Arabic when those apps already do so for artworks.

### Section audio

- Registry: section `id` + `title` + `speechText` per locale (title spoken first except intro).
- Assets: `{museum|gallery}/src/assets/.../audio/{locale}/{workSlug}/{sectionId}.mp3`
- `SectionAudio` passes current page locale into `getSectionAudio`.
- Pause other players when one plays (same as CoE).

### Tooling

- Reuse museum `ARTWORK_LOCALE_TARGETS` voices / DeepL targets.
- Scripts (museum for Dendur; gallery for Kiss, or shared museum scripts with `--app` if simpler):
  - translate section scripts + page copy strings
  - `audio:sections` / generate section MP3s with `--locale` / `--force`
- Commit generated locale TS + MP3s.

### Analytics

- Museum: `{ title: "The Temple of Dendur", path: "/the-temple-of-dendur" }`
- Gallery: `{ title: "The Kiss", path: "/the-kiss" }` (or “The Kiss (Lovers)” if matching page H1 — prefer short title consistent with other gallery entries)
- Remove both from `@tma/analytics-church-of-england`

## Verification

- Museum build includes Dendur; gallery build includes Kiss; CoE build has neither
- `/allpages` lists the new stops on destination apps only
- `?lang=fr` (and other locales) switches visible copy and section players
- EN + at least one non-EN locale smoke-checked for each work
- Analytics packages list the new paths; CoE package does not

## Notes

- Kiss image is large (~7MB); port as-is; optimize later if needed.
- Dendur was previously documented as a CoE stop; this spec supersedes that placement.
