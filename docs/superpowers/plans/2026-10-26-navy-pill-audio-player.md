# Navy Pill Audio Player Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the default browser audio bar in `apps/gallery` and `apps/museum` with the shared Navy pill (Option C) audio player featuring the `"Listen"` label, time readout, gold progress/seek bar, and a floating bottom dock when an active player scrolls out of view.

**Architecture:** Build a shared `BrandAudioPlayer` component (and `formatAudioTime` helper) in `@tma/brand` backed by a hidden `<audio class="tma-audio-player tma-section-audio">` element, custom Navy pill controls, pause-others synchronization, and an `IntersectionObserver` / scroll-driven floating bottom pill when active and scrolled out of view. Style the pill and floating dock in `packages/brand/src/brand.css` and wire `apps/gallery` and `apps/museum` `AudioPlayer` components to use `BrandAudioPlayer`.

**Tech Stack:** React 19, TypeScript 5.9, Vite 8, Vitest 3 (`@tma/brand`)

## Global Constraints

- Scope is strictly `@tma/brand`, `apps/gallery`, and `apps/museum`. Do NOT modify `apps/church_of_england`, `apps/arkin_museum`, `apps/friezegallery`, or `apps/birmingham_conference`.
- Keep the underlying `<audio class="tma-audio-player tma-section-audio">` element in the DOM so existing pause-others queries (`document.querySelectorAll("audio.tma-audio-player")`) continue to work.
- Navy pill layout must follow Option C: play/pause circle button on the left (`44px`), and on the right a top row with `"Listen"` on the left and `current / duration` on the right above a full-width gold progress/seek bar.
- Floating dock appears at the bottom of the viewport only when playback has started on that player (`hasStarted` is true and not ended/superseded) and the in-page pill has scrolled out of view.

---

### Task 1: Shared `BrandAudioPlayer` Component & Styles in `@tma/brand`

**Files:**
- Create: `packages/brand/src/BrandAudioPlayer.tsx`
- Create: `packages/brand/src/BrandAudioPlayer.test.ts`
- Modify: `packages/brand/src/index.ts`
- Modify: `packages/brand/src/brand.css`

**Interfaces:**
- Produces:
  - `export function formatAudioTime(seconds: number): string` in `packages/brand/src/BrandAudioPlayer.tsx`
  - `export function shouldShowFloatingAudioPill(state: { hasStarted: boolean; isInView: boolean }): boolean` in `packages/brand/src/BrandAudioPlayer.tsx`
  - `export function BrandAudioPlayer({ src, label }: { src: string; label?: string }): JSX.Element` re-exported from `packages/brand/src/index.ts`

- [ ] **Step 1: Write the failing unit tests in `packages/brand/src/BrandAudioPlayer.test.ts`**

```ts
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import {
  BrandAudioPlayer,
  formatAudioTime,
  shouldShowFloatingAudioPill,
} from "./BrandAudioPlayer"

describe("formatAudioTime", () => {
  it("formats valid seconds as M:SS and invalid values as --:--", () => {
    expect(formatAudioTime(0)).toBe("0:00")
    expect(formatAudioTime(72.4)).toBe("1:12")
    expect(formatAudioTime(248)).toBe("4:08")
    expect(formatAudioTime(Number.NaN)).toBe("--:--")
    expect(formatAudioTime(Number.POSITIVE_INFINITY)).toBe("--:--")
    expect(formatAudioTime(-5)).toBe("--:--")
  })
})

describe("shouldShowFloatingAudioPill", () => {
  it("returns true only when playback has started and the in-page player is out of view", () => {
    expect(shouldShowFloatingAudioPill({ hasStarted: false, isInView: true })).toBe(false)
    expect(shouldShowFloatingAudioPill({ hasStarted: false, isInView: false })).toBe(false)
    expect(shouldShowFloatingAudioPill({ hasStarted: true, isInView: true })).toBe(false)
    expect(shouldShowFloatingAudioPill({ hasStarted: true, isInView: false })).toBe(true)
  })
})

describe("BrandAudioPlayer", () => {
  it("renders the navy pill with Listen kicker, time readout, seek bar, and hidden audio element", () => {
    const html = renderToStaticMarkup(
      createElement(BrandAudioPlayer, { src: "/audio/the-kiss.mp3" })
    )
    expect(html).toContain("tma-navy-pill")
    expect(html).toContain("Listen")
    expect(html).toContain("0:00 / --:--")
    expect(html).toContain('aria-label="Play audio"')
    expect(html).toContain('aria-label="Seek audio"')
    expect(html).toContain('class="tma-audio-player tma-section-audio"')
    expect(html).toContain('src="/audio/the-kiss.mp3"')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm --prefix /Users/florentgiovannone/Desktop/development/a_bet_a/takemearound/TMA_frontend test -w @tma/brand`
Expected: FAIL with module `./BrandAudioPlayer` not found.

- [ ] **Step 3: Implement `packages/brand/src/BrandAudioPlayer.tsx` and export from `packages/brand/src/index.ts`**

Create `packages/brand/src/BrandAudioPlayer.tsx`:

```tsx
import { useEffect, useRef, useState, type CSSProperties, type ChangeEvent } from "react"

export function formatAudioTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "--:--"
  const totalSeconds = Math.floor(seconds)
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`
}

export function shouldShowFloatingAudioPill({
  hasStarted,
  isInView,
}: {
  hasStarted: boolean
  isInView: boolean
}): boolean {
  return hasStarted && !isInView
}

type PillControlsProps = {
  label: string
  isPlaying: boolean
  currentTime: number
  duration: number
  onTogglePlay: () => void
  onSeek: (event: ChangeEvent<HTMLInputElement>) => void
  floating?: boolean
}

function PillControls({
  label,
  isPlaying,
  currentTime,
  duration,
  onTogglePlay,
  onSeek,
  floating = false,
}: PillControlsProps) {
  const progressPercent =
    Number.isFinite(duration) && duration > 0
      ? Math.min(100, Math.max(0, (currentTime / duration) * 100))
      : 0

  const timeText = `${formatAudioTime(currentTime)} / ${
    Number.isFinite(duration) && duration > 0 ? formatAudioTime(duration) : "--:--"
  }`

  return (
    <div
      className={
        floating
          ? "tma-navy-pill tma-navy-pill--floating"
          : "tma-navy-pill"
      }
      role={floating ? "region" : undefined}
      aria-label={floating ? "Floating audio player" : undefined}
    >
      <button
        type="button"
        className="tma-navy-pill-btn"
        onClick={onTogglePlay}
        aria-label={isPlaying ? "Pause audio" : "Play audio"}
      >
        {isPlaying ? (
          <span className="tma-navy-pill-pause" aria-hidden="true" />
        ) : (
          <span className="tma-navy-pill-play" aria-hidden="true" />
        )}
      </button>
      <div className="tma-navy-pill-mid">
        <div className="tma-navy-pill-top">
          <span className="tma-navy-pill-kicker">{label}</span>
          <span className="tma-navy-pill-time">{timeText}</span>
        </div>
        <div
          className="tma-navy-pill-track"
          style={{ "--tma-pill-progress": `${progressPercent}%` } as CSSProperties}
        >
          <span className="tma-navy-pill-fill" aria-hidden="true" />
          <input
            type="range"
            className="tma-navy-pill-range"
            aria-label="Seek audio"
            min={0}
            max={Number.isFinite(duration) && duration > 0 ? duration : 0}
            step={0.1}
            value={Number.isFinite(currentTime) ? currentTime : 0}
            disabled={!Number.isFinite(duration) || duration <= 0}
            onChange={onSeek}
          />
        </div>
      </div>
    </div>
  )
}

export function BrandAudioPlayer({
  src,
  label = "Listen",
}: {
  src: string
  label?: string
}) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(Number.NaN)
  const [isInView, setIsInView] = useState(true)

  useEffect(() => {
    setIsPlaying(false)
    setHasStarted(false)
    setCurrentTime(0)
    setDuration(Number.NaN)
  }, [src])

  useEffect(() => {
    const el = audioRef.current
    if (!el) return

    const onPlay = () => {
      setIsPlaying(true)
      setHasStarted(true)
      document.querySelectorAll("audio.tma-audio-player").forEach((node) => {
        if (!(node instanceof HTMLAudioElement)) return
        if (node !== el && !node.paused) node.pause()
      })
    }

    const onPause = () => {
      setIsPlaying(false)
    }

    const onEnded = () => {
      setIsPlaying(false)
      setHasStarted(false)
      setCurrentTime(0)
    }

    const onTimeUpdate = () => {
      setCurrentTime(el.currentTime || 0)
    }

    const onLoadedMetadata = () => {
      if (Number.isFinite(el.duration) && el.duration > 0) {
        setDuration(el.duration)
      }
    }

    const onOtherPlay = (event: Event) => {
      const target = event.target
      if (
        target instanceof HTMLAudioElement &&
        target !== el &&
        target.classList.contains("tma-audio-player")
      ) {
        setHasStarted(false)
        setIsPlaying(false)
      }
    }

    if (Number.isFinite(el.duration) && el.duration > 0) {
      setDuration(el.duration)
    }

    el.addEventListener("play", onPlay)
    el.addEventListener("pause", onPause)
    el.addEventListener("ended", onEnded)
    el.addEventListener("timeupdate", onTimeUpdate)
    el.addEventListener("loadedmetadata", onLoadedMetadata)
    el.addEventListener("durationchange", onLoadedMetadata)
    document.addEventListener("play", onOtherPlay, true)

    return () => {
      el.removeEventListener("play", onPlay)
      el.removeEventListener("pause", onPause)
      el.removeEventListener("ended", onEnded)
      el.removeEventListener("timeupdate", onTimeUpdate)
      el.removeEventListener("loadedmetadata", onLoadedMetadata)
      el.removeEventListener("durationchange", onLoadedMetadata)
      document.removeEventListener("play", onOtherPlay, true)
    }
  }, [src])

  useEffect(() => {
    const anchor = anchorRef.current
    if (!anchor) return

    if (typeof IntersectionObserver !== "undefined") {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry) setIsInView(entry.isIntersecting)
        },
        { threshold: 0 }
      )
      observer.observe(anchor)
      return () => observer.disconnect()
    }

    const updateOnScroll = () => {
      const rect = anchor.getBoundingClientRect()
      setIsInView(rect.bottom > 0 && rect.top < window.innerHeight)
    }
    window.addEventListener("scroll", updateOnScroll, { passive: true })
    updateOnScroll()
    return () => window.removeEventListener("scroll", updateOnScroll)
  }, [])

  const togglePlay = () => {
    const el = audioRef.current
    if (!el) return
    if (el.paused) {
      void el.play()
    } else {
      el.pause()
    }
  }

  const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current
    const nextTime = Number(event.target.value)
    if (!el || !Number.isFinite(nextTime)) return
    el.currentTime = nextTime
    setCurrentTime(nextTime)
  }

  const showFloating = shouldShowFloatingAudioPill({ hasStarted, isInView })

  return (
    <div ref={anchorRef} className="tma-audio-pill-anchor tma-section-audio">
      <audio
        ref={audioRef}
        className="tma-audio-player tma-section-audio"
        preload="metadata"
        src={src}
      >
        Your browser does not support the audio element.
      </audio>
      <PillControls
        label={label}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onTogglePlay={togglePlay}
        onSeek={handleSeek}
      />
      {showFloating ? (
        <PillControls
          label={label}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onTogglePlay={togglePlay}
          onSeek={handleSeek}
          floating
        />
      ) : null}
    </div>
  )
}
```

Update `packages/brand/src/index.ts`:

```ts
export { ArtworkFrame } from "./ArtworkFrame"
export type { ArtworkSection } from "./ArtworkFrame"
export { ArtworkTextSize, useArtworkTextScale } from "./ArtworkTextSize"
export {
  BrandAudioPlayer,
  formatAudioTime,
  shouldShowFloatingAudioPill,
} from "./BrandAudioPlayer"
export { BrandHeader } from "./BrandHeader"
export { isBrandedDashboardPath } from "./isBrandedDashboardPath"
```

Append the Navy pill and floating dock styles to `packages/brand/src/brand.css`:

```css
.tma-audio-pill-anchor {
  display: block;
  width: 100%;
  margin: 0 auto 22px;
}

.tma-audio-pill-anchor > audio.tma-audio-player {
  display: none;
}

.tma-navy-pill {
  display: grid;
  grid-template-columns: 44px 1fr;
  align-items: center;
  gap: 14px;
  padding: 12px 20px 12px 12px;
  border-radius: 999px;
  background: var(--tma-navy);
  color: var(--tma-hero-title);
  font-family: var(--tma-font-ui);
  box-sizing: border-box;
}

.tma-navy-pill--floating {
  position: fixed;
  left: 50%;
  bottom: 18px;
  z-index: 50;
  width: min(720px, calc(100% - 32px));
  transform: translateX(-50%);
  box-shadow: 0 12px 28px rgba(14, 35, 71, 0.28);
}

.tma-navy-pill-btn {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: var(--tma-hero-title);
  color: var(--tma-navy);
  cursor: pointer;
}

.tma-navy-pill-btn:focus-visible {
  outline: 2px solid var(--tma-gold);
  outline-offset: 2px;
}

.tma-navy-pill-play {
  display: block;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 8px 0 8px 13px;
  border-color: transparent transparent transparent currentColor;
  margin-left: 3px;
}

.tma-navy-pill-pause {
  display: inline-flex;
  gap: 4px;
  width: 12px;
  height: 14px;
}

.tma-navy-pill-pause::before,
.tma-navy-pill-pause::after {
  content: "";
  flex: 1;
  border-radius: 1px;
  background: currentColor;
}

.tma-navy-pill-mid {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.tma-navy-pill-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}

.tma-navy-pill-kicker {
  color: var(--tma-hero-subtitle);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.tma-navy-pill-time {
  color: var(--tma-hero-subtitle);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.06em;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.tma-navy-pill-track {
  position: relative;
  height: 4px;
  border-radius: 999px;
  background: rgba(247, 243, 234, 0.25);
}

.tma-navy-pill-fill {
  display: block;
  width: var(--tma-pill-progress, 0%);
  height: 100%;
  border-radius: inherit;
  background: var(--tma-gold);
  pointer-events: none;
}

.tma-navy-pill-range {
  position: absolute;
  inset: -8px 0;
  width: 100%;
  height: 20px;
  margin: 0;
  opacity: 0;
  cursor: pointer;
}

.tma-navy-pill-range:disabled {
  cursor: default;
}
```

- [ ] **Step 4: Run `@tma/brand` tests to verify they pass**

Run: `npm --prefix /Users/florentgiovannone/Desktop/development/a_bet_a/takemearound/TMA_frontend test -w @tma/brand`
Expected: PASS (all tests in `ArtworkFrame.test.ts`, `BrandAudioPlayer.test.ts`, `isBrandedDashboardPath.test.ts` pass).

- [ ] **Step 5: Commit Task 1**

```bash
cd /Users/florentgiovannone/Desktop/development/a_bet_a/takemearound/TMA_frontend
git add packages/brand/src/BrandAudioPlayer.tsx packages/brand/src/BrandAudioPlayer.test.ts packages/brand/src/index.ts packages/brand/src/brand.css
git commit -m "Add BrandAudioPlayer Navy pill component and styles"
```

---

### Task 2: Wire `apps/gallery` and `apps/museum` to `BrandAudioPlayer`

**Files:**
- Modify: `apps/gallery/src/components/AudioPlayer.tsx`
- Modify: `apps/gallery/src/styles/the-kiss.css`
- Modify: `apps/museum/src/components/AudioPlayer.tsx`
- Modify: `apps/museum/src/styles/the-temple-of-dendur.css`

**Interfaces:**
- Consumes: `BrandAudioPlayer` from `@tma/brand`
- Produces: Default-exported `AudioPlayer({ src }: { src: string })` in both `apps/gallery` and `apps/museum`

- [ ] **Step 1: Update `apps/gallery/src/components/AudioPlayer.tsx` and `apps/museum/src/components/AudioPlayer.tsx`**

Replace `apps/gallery/src/components/AudioPlayer.tsx` with:

```tsx
import { BrandAudioPlayer } from "@tma/brand"

type AudioPlayerProps = {
  src: string
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  return <BrandAudioPlayer src={src} />
}
```

Replace `apps/museum/src/components/AudioPlayer.tsx` with:

```tsx
import { BrandAudioPlayer } from "@tma/brand"

type AudioPlayerProps = {
  src: string
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  return <BrandAudioPlayer src={src} />
}
```

- [ ] **Step 2: Update section-audio margin selectors in `the-kiss.css` and `the-temple-of-dendur.css`**

In `apps/gallery/src/styles/the-kiss.css`, update `.the-kiss audio.tma-section-audio` so the pill wrapper gets the section spacing without unhiding the hidden `<audio>` element:

```css
.the-kiss .tma-audio-pill-anchor.tma-section-audio {
  display: block;
  width: 100%;
  margin: 28px 0 12px;
}
```

In `apps/museum/src/styles/the-temple-of-dendur.css`, update `.the-temple-of-dendur audio.tma-section-audio` similarly:

```css
.the-temple-of-dendur .tma-audio-pill-anchor.tma-section-audio {
  display: block;
  width: 100%;
  margin: 28px 0 12px;
}
```

- [ ] **Step 3: Run typechecks and builds for `apps/gallery`, `apps/museum`, and `@tma/brand` tests**

Run:
```bash
cd /Users/florentgiovannone/Desktop/development/a_bet_a/takemearound/TMA_frontend && npm test -w @tma/brand && npm run build -w @tma/app-gallery && npm run build -w @tma/app-museum
```
Expected: All tests pass, `tsc --noEmit` and `vite build` succeed for both `@tma/app-gallery` and `@tma/app-museum`.

- [ ] **Step 4: Commit Task 2**

```bash
cd /Users/florentgiovannone/Desktop/development/a_bet_a/takemearound/TMA_frontend
git add apps/gallery/src/components/AudioPlayer.tsx apps/gallery/src/styles/the-kiss.css apps/museum/src/components/AudioPlayer.tsx apps/museum/src/styles/the-temple-of-dendur.css
git commit -m "Use Navy pill BrandAudioPlayer in gallery and museum apps"
```
