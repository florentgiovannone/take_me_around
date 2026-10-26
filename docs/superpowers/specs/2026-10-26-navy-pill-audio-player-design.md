# Navy Pill Audio Player with Floating Dock — Design

**Date:** 2026-10-26  
**Status:** Approved for planning  
**Apps in scope:** `apps/gallery`, `apps/museum` (shared component and styles in `@tma/brand`)  

## Goal

Replace the default browser `<audio controls>` bar in `apps/gallery` and `apps/museum` with the **Navy pill (Option C)** audio player — featuring `"Listen"` and `current / duration` above a gold progress bar inside a rounded navy pill — and keep a floating bottom pill visible while an active player is scrolled out of view.

## Scope

### In scope
- `packages/brand`: Shared `BrandAudioPlayer` component (or exported `AudioPlayer`) and CSS in `brand.css`.
- `apps/gallery`: `AudioPlayer` and `SectionAudio` (all artwork pages + `TheKissPage`).
- `apps/museum`: `AudioPlayer` and `SectionAudio` (all artwork pages + `TempleOfDendurPage`).

### Out of scope
- `apps/church_of_england`, `apps/arkin_museum`, `apps/friezegallery`, `apps/birmingham_conference`, and other apps.
- Regenerating or modifying `.mp3` assets.

## Visual & Layout Design (Option C — Navy Pill)

### In-page pill
- **Container:** Rounded pill (`border-radius: 999px`), background `var(--tma-navy)` (`#0e2347`), text color `var(--tma-hero-title)` (`#f7f3ea`), grid layout `grid-template-columns: 44px 1fr` with `14px` gap and `12px 20px 12px 12px` padding.
- **Play / Pause button:** `44px × 44px` circle (`border-radius: 50%`), background `var(--tma-hero-title)` (`#f7f3ea`), icon color `var(--tma-navy)` (`#0e2347`). Displays a play triangle when paused and two pause bars when playing.
- **Right column (stacked with `6px` gap):**
  - **Top row (`flex`, `justify-content: space-between`, `align-items: baseline`):**
    - Left: `"Listen"` kicker in `var(--tma-hero-subtitle)` (`#d7c4a4`), `12px`, `font-weight: 600`, `letter-spacing: 0.16em`, `text-transform: uppercase`.
    - Right: Time readout `M:SS / M:SS` (e.g. `1:12 / 4:08`, or `0:00 / --:--` before metadata loads) in `var(--tma-hero-subtitle)`, `13px`, `font-weight: 600`, `letter-spacing: 0.06em`, `font-variant-numeric: tabular-nums`.
  - **Bottom row (progress / seek bar):**
    - `4px` visual track height inside an accessible click/drag/keyboard seek target (`<input type="range">` or interactive track), background `rgba(247, 243, 234, 0.25)`, filled portion in `var(--tma-gold)` (`#b08958`).

### Floating bottom dock
- **Trigger:** Appears only when:
  1. This `AudioPlayer` instance is currently active (playing, or was the most recently played and hasn't ended/reset), AND
  2. The in-page pill element is scrolled out of the viewport (observed via `IntersectionObserver` / scroll check).
- **Dismissal:** Automatically hides when the user scrolls back so the in-page pill is visible again, or when playback finishes (`ended`).
- **Positioning & style:** Fixed at the bottom center of the viewport (`position: fixed; left: 50%; bottom: 18px; transform: translateX(-50%); width: min(720px, calc(100% - 32px)); z-index: 50`), using the same Navy pill Option C layout with an elevated shadow (`0 12px 28px rgba(14, 35, 71, 0.28)`).
- **Single active audio:** Starting any `AudioPlayer` on the page pauses all other `<audio class="tma-audio-player">` elements, ensuring at most one floating dock is ever shown at a time.

## Architecture & Data Flow

1. **Hidden native `<audio>` element:**
   - Each `AudioPlayer` renders a hidden `<audio ref={audioRef} className="tma-audio-player tma-section-audio" preload="metadata" src={src} />`.
   - Preserves existing pause-others behavior: on `play`, pauses every other `audio.tma-audio-player` in `document`.
2. **State & events:**
   - `isPlaying`: updated on `play`, `pause`, `ended`.
   - `hasStarted`: set to `true` on `play`, reset to `false` on `ended` or when another `audio.tma-audio-player` starts playing.
   - `currentTime` & `duration`: updated on `timeupdate`, `loadedmetadata`, `durationchange`.
   - `isOutOfView`: tracked via `IntersectionObserver` on the in-page pill wrapper.
   - Floating dock renders (or transitions to visible) when `hasStarted && (isPlaying || currentTime > 0) && isOutOfView`.
3. **Controls & Accessibility:**
   - Play/Pause button is a `<button type="button" aria-label={isPlaying ? "Pause audio" : "Play audio"}>`.
   - Seek bar uses an `<input type="range" aria-label="Seek audio" min={0} max={duration || 0} step={0.1} value={currentTime} />` styled with the gold fill track so keyboard, mouse, and touch seeking all work natively.

## Testing

- Unit / component tests verifying:
  - Renders the `"Listen"` label, play button, seek input, and formatted time.
  - Clicking play/pause toggles playback on the underlying `<audio>` element and pauses other `.tma-audio-player` elements.
  - Floating dock state activates only when playback has started and the in-page player leaves the viewport.
- Typechecks (`tsc --noEmit`) and builds across `apps/gallery` and `apps/museum`.
