# CoE section audio — design

**Date:** 2026-07-29  
**Status:** Approved for implementation  
**App:** `apps/church_of_england`

## Goal

Per-section English audio under each exhibit `h2`, generated with ElevenLabs, so visitors can play only the sections they want.

## Decisions

| Topic | Choice |
|-------|--------|
| Works | Westminster Abbey, Southwell Minster, Temple of Dendur, The Kiss |
| Placement | Above each section `h2` (intro lede: above the opening paragraph) |
| Spoken heading | Section `h2` title is spoken at the start of each clip (except intro) |
| Page-level player | Remove |
| Language | English only (v1) |
| Generation | ElevenLabs via CoE script, museum-style env |

## Architecture

- Section registries: `src/data/*Sections.ts` with `{ id, title, speechText }[]`
- `getSectionAudio(workSlug, sectionId)` → Vite URL or null
- Files: `src/assets/church-of-england/audio/en/{work}/{section}.mp3`
- Script: `scripts/generate-section-audio.mjs` + `npm run audio:sections`
- Optional: pause other `<audio>` when one plays

## Verification

- Build passes
- Players render above section titles when mp3s exist
- Spoken audio begins with the section heading (except intro ledes)
- Generation script dry-run lists sections; live run needs `ELEVENLABS_API_KEY`
