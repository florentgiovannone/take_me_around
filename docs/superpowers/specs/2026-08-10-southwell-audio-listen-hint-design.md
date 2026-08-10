# Southwell audio listen hint — design

**Date:** 2026-08-10  
**Status:** Approved for planning  
**App:** `apps/church_of_england`  
**Approach:** Enhance `SectionAudio` with optional outline headphone glyph + optional italic hint, opt-in on Southwell only

## Goal

Help visitors notice per-section audio on the Southwell Minster page: show a short headphones note above the first player, and the same headphone glyph with every section audio control.

## Decisions

| Topic | Choice |
|-------|--------|
| Scope | Southwell Minster only (not Westminster, not other apps) |
| Pattern | Enhance shared CoE `SectionAudio` with optional `showHint` and `showIcon` (Southwell opt-in) |
| Glyph | Outline headphones SVG from headphone-glyph pack (`currentColor`, ~1em) |
| Hint placement | Above History section’s audio player only (`showHint`) |
| Hint style | Italic, ~0.9–0.95rem, soft ink, readable line-height |
| Other Southwell sections | Outline glyph above each section player via `showIcon` when audio exists |
| Default (Westminster etc.) | Plain `AudioPlayer` when `src` exists; render nothing when missing — no glyph or wrapper |

## Hint copy (exact)

> Where you see the audio control below, and in each section where you see an audio icon, you can listen as you browse or move around. Please use your headphones or ear pods.

## Out of scope

- Westminster Abbey or other CoE stops
- Museum / gallery / Arkin apps
- Changing pause-others audio behaviour
- Adding or regenerating mp3 assets
- Cards, badges, or floating overlays on media

## Architecture

```
apps/church_of_england/
  src/components/SectionAudio.tsx     # optional glyph/hint wrapper + AudioPlayer
  src/pages/SouthwellMinsterPage.tsx  # showHint on History; showIcon on other sections
  src/styles/southwell-minster.css    # hint / icon spacing under .southwell-minster
```

### `SectionAudio` behaviour

1. Resolve `src` via `getSectionAudio(workSlug, sectionId)`; if null, render nothing.
2. When neither `showHint` nor `showIcon` is true (default — Westminster etc.): render plain `<AudioPlayer src={src} />` only.
3. When `showHint` and/or `showIcon` is true (Southwell opt-in): wrap in `.tma-section-audio-block` with glyph and/or hint plus `AudioPlayer`.
4. When `showHint` is true: render the italic hint copy above the player (paired with the glyph so the icon can be `aria-hidden` next to the text).
5. When `showIcon` is true and `showHint` is false: render the outline headphone glyph above the player; glyph is meaningful alone → `role="img"` + `aria-label="Headphones"` (or equivalent).

### Southwell call sites

- History: `showHint`
- Treasures, officers, music, worship: `showIcon`
- Westminster and other pages: no props — unchanged plain player behaviour

### Accessibility

- Hint text is real content (not `aria-only`).
- Avoid double announcement: if visible hint text is present, glyph is decorative (`aria-hidden`); otherwise glyph is labeled.
- Do not rely on colour alone for the cue.

## Visual notes

- Match existing Southwell type: soft ink for body/hint; no new accent colour.
- Keep layout compact inside `.section-head-main` (flex column already used for player + heading).
- Icon sits with the audio control row so later sections visually match the “audio icon” mentioned in the hint.

## Self-review

- No placeholders or TBD copy.
- Scope limited to Southwell + `SectionAudio` enhancement.
- No contradiction with existing section-audio design (still uses `getSectionAudio` + `AudioPlayer`; default path unchanged for non-Southwell pages).
