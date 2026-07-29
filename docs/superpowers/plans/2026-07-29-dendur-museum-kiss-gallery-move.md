# Dendur → Museum + Kiss → Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move Temple of Dendur to museum and The Kiss to gallery with full locale parity (page copy + per-section audio), then remove both from Church of England.

**Architecture:** Lift custom essay pages into destination apps; drive all visible strings from locale copy modules; resolve locale via existing `detectArtworkPageLocale`; serve per-section MP3s from `audio/{locale}/{work}/{section}.mp3`; translate with DeepL and synthesize with ElevenLabs using museum locale/voice targets.

**Tech Stack:** React 19, Vite, TypeScript, DeepL, ElevenLabs, `@tma/analytics-museum`, `@tma/analytics-gallery`

## Global Constraints

- Locales: `en`, `fr`, `ja`, `ar`, `de`, `es`, `ko`, `zh`, `pt`, `tr`, `it`
- Dendur route: `/the-temple-of-dendur` on museum only
- Kiss route: `/the-kiss` on gallery only
- CoE must not retain Dendur or Kiss pages, assets, routes, analytics, or section-audio entries
- Keep custom scoped CSS layouts (`.temple-of-dendur`, `.the-kiss`)
- Section audio above each `h2` (intro above lede); speak heading then body except intro
- Do not commit secrets (`.env.local`)
- Prefer build verification over inventing new Jest suites (repo has no page unit-test harness)

---

## File map

### Museum (Dendur)

| Path | Role |
|------|------|
| `apps/museum/src/data/templeOfDendur.ts` | `TempleOfDendurCopy` type + `TEMPLE_OF_DENDUR_EN` |
| `apps/museum/src/data/templeOfDendur.en.json` | EN source for translate script |
| `apps/museum/src/data/templeOfDendur.{fr,ja,...}.ts` | Translated copies |
| `apps/museum/src/utils/templeOfDendurLocale.ts` | detect + resolve |
| `apps/museum/src/pages/TempleOfDendurPage.tsx` | Localized essay page |
| `apps/museum/src/styles/temple-of-dendur.css` | Scoped CSS (copied) |
| `apps/museum/src/assets/museum/images/temple-of-dendur.jpg` | Hero image |
| `apps/museum/src/assets/museum/audio/{locale}/the-temple-of-dendur/*.mp3` | Section audio |
| `apps/museum/src/assets/museum/sectionAudio.ts` | `getSectionAudio(work, section, locale)` |
| `apps/museum/src/components/SectionAudio.tsx` | Locale-aware section player |
| `apps/museum/src/components/AudioPlayer.tsx` | Add pause-others behavior |
| `apps/museum/scripts/section-audio.config.mjs` | Dendur speech scripts |
| `apps/museum/scripts/generate-section-audio.mjs` | ElevenLabs section TTS |
| `apps/museum/scripts/translate-essay-artwork.mjs` | DeepL for essay JSON shape |
| `apps/museum/scripts/artworks.config.mjs` | Register `the-temple-of-dendur` if needed for tooling |
| `apps/museum/src/App.tsx` | Route + `/allpages` + titles |
| `packages/analytics-museum/src/index.ts` | Track Dendur |

### Gallery (Kiss)

| Path | Role |
|------|------|
| `apps/gallery/src/data/theKiss.ts` | `TheKissCopy` type + `THE_KISS_EN` |
| `apps/gallery/src/data/theKiss.en.json` | EN source |
| `apps/gallery/src/data/theKiss.{locale}.ts` | Translated copies |
| `apps/gallery/src/utils/theKissLocale.ts` | detect + resolve |
| `apps/gallery/src/pages/TheKissPage.tsx` | Localized essay page |
| `apps/gallery/src/styles/the-kiss.css` | Scoped CSS |
| `apps/gallery/src/assets/gallery/images/the-kiss.jpg` | Image |
| `apps/gallery/src/assets/gallery/audio/{locale}/the-kiss/*.mp3` | Section audio |
| `apps/gallery/src/assets/gallery/sectionAudio.ts` | `getSectionAudio` |
| `apps/gallery/src/components/SectionAudio.tsx` | Section player |
| `apps/gallery/src/components/AudioPlayer.tsx` | Pause-others |
| `apps/museum/scripts/section-audio.config.mjs` | Also define `the-kiss` with `app: "gallery"` |
| `apps/gallery/src/App.tsx` | Route + `/allpages` |
| `packages/analytics-gallery/src/index.ts` | Track Kiss |

### CoE removal

| Path | Action |
|------|--------|
| Pages, CSS, images, audio for Dendur/Kiss | Delete |
| `App.tsx`, analytics-church-of-england | Unwire |
| `scripts/section-audio.config.mjs` | Remove Dendur + Kiss keys |

### Shared copy shape

```ts
export type EssayFact = { k: string; v: string }
export type EssayMotif = { label: string; text: string }
export type EssaySection = {
  id: string
  heading: string
  paragraphs: string[]
  motifs?: EssayMotif[]
  afterNote?: string
  quote?: string
  quoteCite?: string
  visitLabel?: string
  visitBody?: string
}

export type TempleOfDendurCopy = {
  banner: string
  eyebrow: string
  title: string
  subtitle: string
  imageAlt: string
  figcaption: string
  credit: string
  facts: EssayFact[]
  lede: string
  sections: EssaySection[] // excludes intro; intro = lede only
  colophonLeft: string
  colophonRight: string
}
```

Kiss adds `titleEm: string` (e.g. `(Lovers)`).

Speech scripts live in `section-audio.config.mjs` (not page copy) so TTS can stay shorter than essay text.

---

### Task 1: Museum section-audio plumbing + Dendur EN page

**Files:**
- Create: museum `sectionAudio.ts`, `SectionAudio.tsx`, Dendur data/utils/page/css/image
- Modify: `AudioPlayer.tsx`, `App.tsx`, `analytics-museum`, `package.json` scripts
- Copy EN mp3s from CoE into `apps/museum/src/assets/museum/audio/en/the-temple-of-dendur/`

**Interfaces:**
- Produces: `getSectionAudio(workSlug: string, sectionId: string, locale?: ArtworkLocale): string | null`
- Produces: `SectionAudio({ workSlug, sectionId, locale })`
- Produces: `resolveTempleOfDendurCopy(locale): TempleOfDendurCopy`

- [ ] **Step 1: Add `getSectionAudio` via glob**

```ts
// apps/museum/src/assets/museum/sectionAudio.ts
import type { ArtworkLocale } from "./audio"

const modules = import.meta.glob("./audio/**/*.mp3", {
  eager: true,
  import: "default",
}) as Record<string, string>

export function getSectionAudio(
  workSlug: string,
  sectionId: string,
  locale: ArtworkLocale = "en",
): string | null {
  const key = `./audio/${locale}/${workSlug}/${sectionId}.mp3`
  const localized = modules[key]
  if (localized) return localized
  if (locale !== "en") {
    return modules[`./audio/en/${workSlug}/${sectionId}.mp3`] ?? null
  }
  return null
}
```

- [ ] **Step 2: Port `SectionAudio` + update `AudioPlayer` pause-others (same as CoE)**

- [ ] **Step 3: Extract EN Dendur copy from current CoE page into `templeOfDendur.en.json` + `templeOfDendur.ts`; write `templeOfDendurLocale.ts`**

- [ ] **Step 4: Port page/CSS/image; wire locale + `SectionAudio` with `locale` prop; register route/allpages/analytics**

- [ ] **Step 5: Copy EN section mp3s from CoE; verify museum build**

```bash
cp -R apps/church_of_england/src/assets/church-of-england/audio/en/the-temple-of-dendur \
  apps/museum/src/assets/museum/audio/en/
npm run build -w @tma/app-museum
```

Expected: build succeeds; Dendur route present.

- [ ] **Step 6: Commit** `feat(museum): add Temple of Dendur stop with section audio`

---

### Task 2: Gallery section-audio plumbing + Kiss EN page

**Files:** Mirror Task 1 under gallery for Kiss (`theKiss.*`, `/the-kiss`, analytics-gallery)

- [ ] **Step 1: Add gallery `sectionAudio.ts`, `SectionAudio.tsx`, pause-others on `AudioPlayer`**
- [ ] **Step 2: Extract EN Kiss copy; locale resolver; port page/CSS/image**
- [ ] **Step 3: Copy EN mp3s; wire App + analytics; build gallery**

```bash
cp -R apps/church_of_england/src/assets/church-of-england/audio/en/the-kiss \
  apps/gallery/src/assets/gallery/audio/en/
npm run build -w @tma/app-gallery
```

- [ ] **Step 4: Commit** `feat(gallery): add The Kiss stop with section audio`

---

### Task 3: Remove Dendur + Kiss from CoE

**Files:**
- Delete CoE Dendur/Kiss pages, CSS, images, audio folders
- Modify: CoE `App.tsx`, `section-audio.config.mjs`, `packages/analytics-church-of-england/src/index.ts`

- [ ] **Step 1: Remove routes, imports, allpages links, analytics entries, config keys, assets**
- [ ] **Step 2: Build CoE**

```bash
npm run build -w @tma/app-church-of-england
```

Expected: success; no Dendur/Kiss references in App.

- [ ] **Step 3: Commit** `chore(coe): remove Dendur and Kiss after museum/gallery move`

---

### Task 4: Essay translate script + generate all locale page copies

**Files:**
- Create: `apps/museum/scripts/translate-essay-artwork.mjs`
- Create: translated `templeOfDendur.*.ts`, `theKiss.*.ts`
- Modify: locale resolvers to import all locales

**Essay JSON flatten keys:** `banner`, `eyebrow`, `title`, `titleEm?`, `subtitle`, `imageAlt`, `figcaption`, `credit`, `lede`, `colophonLeft`, `colophonRight`, `fact:{i}:k`, `fact:{i}:v`, `section:{id}:heading`, `section:{id}:p:{j}`, `section:{id}:motif:{k}:label`, `section:{id}:motif:{k}:text`, `section:{id}:afterNote`, `section:{id}:quote`, `section:{id}:quoteCite`, `section:{id}:visitLabel`, `section:{id}:visitBody`. Keep `sections[].id` untranslated.

- [ ] **Step 1: Implement translate-essay-artwork.mjs** (reuse `lib/deepl.mjs`, `ARTWORK_LOCALE_TARGETS`, write TS modules like `translate-artwork.mjs`)
- [ ] **Step 2: Register essay artworks config object in that script (dendur museum, kiss gallery)**
- [ ] **Step 3: Run translations**

```bash
node apps/museum/scripts/translate-essay-artwork.mjs --artwork the-temple-of-dendur
node apps/museum/scripts/translate-essay-artwork.mjs --artwork the-kiss
```

Expected: 10 locale files each (fr…it).

- [ ] **Step 4: Wire resolvers; build museum + gallery**
- [ ] **Step 5: Commit** `feat: add localized Dendur and Kiss page copy`

---

### Task 5: Multilingual section audio (translate scripts + ElevenLabs)

**Files:**
- Create: `apps/museum/scripts/section-audio.config.mjs` (EN speech from CoE + `app` field)
- Create: `apps/museum/scripts/generate-section-audio.mjs` (writes into museum or gallery audio root by `app`)
- Create: optional `translate-section-audio.mjs` OR embed speech translation into generate step via DeepL
- Output: `audio/{locale}/{work}/{section}.mp3` for all locales

Speech spoken text: intro uses `speechText` only; other sections use `${title}. ${speechText}` with translated title+speech.

- [ ] **Step 1: Port EN speech config from CoE for both works**
- [ ] **Step 2: Implement generator with locale targets + voice env keys (same as artwork audio)**
- [ ] **Step 3: Translate speech texts (DeepL) into `section-audio.{locale}.json` or inline cache files under `scripts/section-audio/`
- [ ] **Step 4: Generate all locale MP3s**

```bash
node apps/museum/scripts/generate-section-audio.mjs --work the-temple-of-dendur
node apps/museum/scripts/generate-section-audio.mjs --work the-kiss
```

Expected: 11 locales × (5 Dendur + 5 Kiss) = 110 files (EN already exists; regen or skip).

- [ ] **Step 5: Build both apps; smoke `?lang=fr` resolves French mp3 paths**
- [ ] **Step 6: Commit** `feat: generate multilingual section audio for Dendur and Kiss`

---

### Task 6: Final verification

- [ ] **Step 1: Grep** — no Dendur/Kiss under `apps/church_of_england` or analytics-church-of-england
- [ ] **Step 2: Builds**

```bash
npm run build -w @tma/app-museum
npm run build -w @tma/app-gallery
npm run build -w @tma/app-church-of-england
```

- [ ] **Step 3: Update spec status to Implemented** in `docs/superpowers/specs/2026-07-29-dendur-museum-kiss-gallery-move-design.md`
- [ ] **Step 4: Commit** if docs dirty

---

## Spec coverage check

| Spec item | Task |
|-----------|------|
| Dendur → museum | 1 |
| Kiss → gallery | 2 |
| Remove from CoE | 3 |
| Custom layouts + section audio UX | 1–2 |
| Full locales page copy | 4 |
| Full locales section audio | 5 |
| Analytics packages | 1–3 |
| Build verification | 1–2, 6 |

## Placeholder scan

None intentional.
