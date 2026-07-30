# Southwell Minster — Dean welcome video placeholder

**Date:** 2026-07-29  
**Status:** Implemented  
**App:** `apps/church_of_england`  
**Page:** `/southwell-minster`

## Goal

Add a welcome-video block near the top of the Southwell Minster page for visitors who arrive via NFC. Show invite copy, a video player placeholder (file to be uploaded later), and the Dean’s name/title.

## Decisions

| Topic | Choice |
|-------|--------|
| Placement | Between hero and table of contents |
| Interaction | On-page HTML5 video play control (NFC already opened the page) |
| Invite copy | “Play a welcome message from Father Stephen” |
| Attribution | The Very Reverend / Dr Stephen Evans / Dean of Southwell Minster |
| Video asset | `assets/.../video/southwell/welcome-dean.mp4` (wired via import.meta.glob) |
| Scope | CoE Southwell only; no new route; no analytics change |

## Layout

1. TMA banner  
2. Hero  
3. **Welcome block** (new)  
4. TOC  
5. Existing sections…

### Welcome block contents

- Short invite line (wording above)  
- 16:9 media area:  
  - If video file present → `<video controls playsInline preload="metadata" …>`  
  - Else → visual placeholder labelled e.g. “Welcome video — coming soon”  
- Attribution stack under the player:
  - The Very Reverend  
  - Dr Stephen Evans  
  - Dean of Southwell Minster  

Style under `.southwell-minster` so it matches the page (type, colour, spacing). Avoid heavy card chrome.

## Files

- Modify: `apps/church_of_england/src/pages/SouthwellMinsterPage.tsx`  
- Modify: `apps/church_of_england/src/styles/southwell-minster.css`  
- Asset: `apps/church_of_england/src/assets/church-of-england/video/southwell/welcome-dean.mp4`

## Verification

- Block appears between hero and TOC on `/southwell-minster`  
- Player shows when `welcome-dean.mp4` is present  
- CoE build passes  
