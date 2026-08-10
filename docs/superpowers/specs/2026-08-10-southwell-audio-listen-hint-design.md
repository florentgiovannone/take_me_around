# Southwell audio listen hint — design

**Date:** 2026-08-10  
**Status:** Approved for planning  
**App:** `apps/church_of_england`  
**Approach:** Enhance `SectionAudio` with outline headphone glyph + optional italic hint on Southwell History only

## Goal

Help visitors notice per-section audio on the Southwell Minster page: show a short headphones note above the first player, and the same headphone glyph with every section audio control.

## Decisions

| Topic | Choice |
|-------|--------|
| Scope | Southwell Minster only (not Westminster, not other apps) |
| Pattern | Enhance shared CoE `SectionAudio` with optional `showHint` |
| Glyph | Outline headphones SVG from headphone-glyph pack (`currentColor`, ~1em) |
| Hint placement | Above History section’s audio player only (`showHint`) |
| Hint style | Italic, ~0.9–0.95rem, soft ink, readable line-height |
| Other sections | Same outline glyph next to/above each section player when audio exists |

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
  src/components/SectionAudio.tsx     # glyph + optional hint + AudioPlayer
  src/pages/SouthwellMinsterPage.tsx  # showHint on History SectionAudio only
  src/styles/southwell-minster.css    # hint / icon spacing under .southwell-minster
```

### `SectionAudio` behaviour

1. Resolve `src` via `getSectionAudio(workSlug, sectionId)`; if null, render nothing.
2. Always (when `src` exists): render outline headphone glyph + `AudioPlayer`.
3. When `showHint` is true: also render the italic hint copy above the player (paired with the glyph so the icon can be `aria-hidden` next to the text).
4. When `showHint` is false: glyph is meaningful alone → `role="img"` + `aria-label="Headphones"` (or equivalent).

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
- No contradiction with existing section-audio design (still uses `getSectionAudio` + `AudioPlayer`).
