# Southwell Audio Listen Hint Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On Southwell Minster, show an italic headphones hint above the first section audio player and an outline headphone glyph with every section audio control.

**Architecture:** Enhance CoE `SectionAudio` with optional `showHint` and `showIcon` props and an inline outline headphones SVG (`currentColor`). History passes `showHint`; other Southwell sections pass `showIcon`. Default (Westminster etc.): plain `AudioPlayer` when `src` exists. Styles stay scoped under `.southwell-minster`.

**Tech Stack:** React 19, TypeScript, Vite, existing CoE `AudioPlayer` / `getSectionAudio`

## Global Constraints

- Scope: Southwell Minster only (Westminster and other pages use default `SectionAudio` — plain player, no glyph)
- Hint copy exact: `Where you see the audio control below, and in each section where you see an audio icon, you can listen as you browse or move around. Please use your headphones or ear pods.`
- Glyph: outline headphones from headphone-glyph pack (`currentColor`, ~1em)
- Hint: italic, ~0.9–0.95rem, soft ink; no cards/badges/overlays
- Prefer build verification over inventing a new Jest/Vitest suite (CoE app has no page unit-test harness)
- Do not commit secrets

---

## File map

| Path | Role |
|------|------|
| `apps/church_of_england/src/components/SectionAudio.tsx` | Optional glyph/hint wrapper + `AudioPlayer` |
| `apps/church_of_england/src/pages/SouthwellMinsterPage.tsx` | `showHint` on History; `showIcon` on other Southwell sections |
| `apps/church_of_england/src/styles/southwell-minster.css` | Hint/icon spacing under `.southwell-minster` |

**Spec:** `docs/superpowers/specs/2026-08-10-southwell-audio-listen-hint-design.md`

---

### Task 1: Enhance `SectionAudio` with glyph + optional hint

**Files:**
- Modify: `apps/church_of_england/src/components/SectionAudio.tsx`
- Modify: `apps/church_of_england/src/pages/SouthwellMinsterPage.tsx` (Southwell call sites)
- Modify: `apps/church_of_england/src/styles/southwell-minster.css`

**Interfaces:**
- Consumes: `getSectionAudio(workSlug, sectionId): string | null`, `AudioPlayer({ src: string })`
- Produces: `SectionAudio({ workSlug: string, sectionId: string, showHint?: boolean, showIcon?: boolean })`

- [ ] **Step 1: Replace `SectionAudio.tsx` with opt-in glyph + optional hint**

```tsx
import AudioPlayer from "./AudioPlayer"
import { getSectionAudio } from "../assets/church-of-england"

type SectionAudioProps = {
  workSlug: string
  sectionId: string
  /** When true, show the headphones listen hint above the player (Southwell History). */
  showHint?: boolean
  /** When true, show the headphones glyph above the player (Southwell sections without hint). */
  showIcon?: boolean
}

const HINT_COPY =
  "Where you see the audio control below, and in each section where you see an audio icon, you can listen as you browse or move around. Please use your headphones or ear pods."

function HeadphonesIcon({ decorative }: { decorative: boolean }) {
  return (
    <svg
      className="tma-headphones-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : "Headphones"}
    >
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
    </svg>
  )
}

/** Renders a section player when the matching mp3 exists. */
export default function SectionAudio({
  workSlug,
  sectionId,
  showHint = false,
  showIcon = false,
}: SectionAudioProps) {
  const src = getSectionAudio(workSlug, sectionId)
  if (!src) return null

  if (!showHint && !showIcon) {
    return <AudioPlayer src={src} />
  }

  return (
    <div className="tma-section-audio-block">
      {showHint ? (
        <p className="tma-audio-listen-hint">
          <HeadphonesIcon decorative />
          <span>{HINT_COPY}</span>
        </p>
      ) : (
        <div className="tma-section-audio-icon" aria-hidden={false}>
          <HeadphonesIcon decorative={false} />
        </div>
      )}
      <AudioPlayer src={src} />
    </div>
  )
}
```

- [ ] **Step 2: Pass `showHint` / `showIcon` on Southwell call sites**

In `apps/church_of_england/src/pages/SouthwellMinsterPage.tsx`:

```tsx
<SectionAudio workSlug="southwell-minster" sectionId="history" showHint />
```

Other Southwell sections with audio:

```tsx
<SectionAudio workSlug="southwell-minster" sectionId="treasures" showIcon />
<SectionAudio workSlug="southwell-minster" sectionId="officers" showIcon />
<SectionAudio workSlug="southwell-minster" sectionId="music" showIcon />
<SectionAudio workSlug="southwell-minster" sectionId="worship" showIcon />
```

Westminster and other pages: leave call sites unchanged (no props — plain `AudioPlayer`).

- [ ] **Step 3: Add scoped styles in `southwell-minster.css`**

Append (or place near `.section-head-main .tma-audio-player` rules):

```css
  .southwell-minster .tma-section-audio-block{
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    min-width: 0;
  }
  .southwell-minster .tma-audio-listen-hint{
    display: flex;
    align-items: flex-start;
    gap: 0.45rem;
    margin: 0 0 0.15rem;
    font-size: 0.92rem;
    font-style: italic;
    line-height: 1.45;
    color: var(--ink-soft);
  }
  .southwell-minster .tma-audio-listen-hint .tma-headphones-icon{
    flex: 0 0 auto;
    margin-top: 0.15em;
    font-size: 1.05em;
    color: var(--ink);
  }
  .southwell-minster .tma-section-audio-icon{
    display: flex;
    align-items: center;
    color: var(--ink);
    font-size: 1.15rem;
    line-height: 1;
  }
  .southwell-minster .tma-section-audio-block .tma-audio-player{
    margin: 0 0 0.35rem;
  }
```

- [ ] **Step 4: Verify TypeScript build for CoE**

Run:

```bash
npm run build --workspace=@tma/app-church-of-england
```

Expected: exit code 0 (redirects write + `tsc --noEmit` + `vite build` succeed).

- [ ] **Step 5: Manual check in the running CoE dev server**

With `npm run dev` already on Church of England (`http://localhost:5173/`):

1. Open `/southwell-minster`.
2. History: italic hint with outline headphone icon appears above the first audio control; copy matches the Global Constraints sentence exactly.
3. Treasures / officers / music / worship: outline headphone icon appears with each section player (`showIcon`); no repeated hint paragraph.
4. Westminster Abbey: plain audio players only — no glyph or hint wrapper.
5. Sections without an mp3 still render no audio UI (unchanged null behaviour).

- [ ] **Step 6: Commit**

```bash
git add \
  apps/church_of_england/src/components/SectionAudio.tsx \
  apps/church_of_england/src/pages/SouthwellMinsterPage.tsx \
  apps/church_of_england/src/styles/southwell-minster.css \
  docs/superpowers/specs/2026-08-10-southwell-audio-listen-hint-design.md \
  docs/superpowers/plans/2026-08-10-southwell-audio-listen-hint.md
git commit -m "$(cat <<'EOF'
Add Southwell headphones listen hint above first section audio.

EOF
)"
```

---

## Spec coverage (self-review)

| Spec requirement | Task |
|------------------|------|
| Southwell only | Task 1 (`showHint` / `showIcon` on Southwell; Westminster default unchanged) |
| Exact hint copy | Task 1 `HINT_COPY` |
| Outline glyph on Southwell section players | Task 1 glyph when `showHint` or `showIcon` is true |
| Default plain player (Westminster etc.) | Task 1 returns `<AudioPlayer />` when neither prop is set |
| Italic smaller hint | Task 1 CSS |
| a11y: decorative vs labeled icon | Task 1 `HeadphonesIcon` |
| No new test harness | Build + manual verification |

## Placeholder / consistency scan

- No TBD/TODO steps.
- Prop names `showHint` and `showIcon` consistent across component and page.
- Class names `tma-section-audio-block`, `tma-audio-listen-hint`, `tma-headphones-icon`, `tma-section-audio-icon` used consistently in TSX and CSS.
