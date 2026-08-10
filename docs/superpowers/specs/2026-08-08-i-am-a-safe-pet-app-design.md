# I Am A Safe Pet app — design

**Date:** 2026-08-08  
**Status:** Spec ready for implementation approval (open questions 1–3 locked; aligned to `safe_pet_page` example)  
**Approach:** Standalone product app (not a museum shell clone) + typed pet/scan data layer with a replaceable repository  
**Visual / UX reference:** `/Users/florentgiovannone/Desktop/safe_pet_page` (static A4 marketing layout)

## Goal

Add a new public frontend `apps/i_am_a_safe_pet` (`@tma/app-i-am-a-safe-pet`) to the Take Me Around monorepo. The product helps someone who finds a lost pet identify the animal, contact the owner safely, and understand safety-critical personality notes. Owners see whether their pet’s tag/page was scanned or marked found.

## Design reference: `safe_pet_page`

The Desktop example is the **visual, brand, and home-page composition** source of truth. It is **not** a product app and must not be copied as architecture.

### What the example contains

| Item | Detail |
|------|--------|
| Stack | Single static `index.html` (inline CSS + tiny toolbar JS). No React, router, or build step. |
| Pages | One A4 print page only |
| Layout | Absolutely positioned A4 sheet (`21cm × 29.7cm`): title → dog/cat row with speech bubbles → NFC pictogram → placeholder text |
| Brand lockup | Title: **I'm a safe pet** (Georgia / Times New Roman, 48pt, centered) |
| Characters | Cut-out `scottie.png` (Scottish Terrier) + `tabby.png` (tabby cat), transparent studio cutouts |
| Speech copy | Dog: “I'm a safe pet, are you?” · Cat: “I most certainly am.” |
| NFC cue | `nfc_tap_pictogram.svg` — navy ring, gold accent, phone + NFC waves |
| Palette (from SVG) | Navy `#122042`, deep blue `#1C448C`, bright blue `#0084FF`, gold `#F0BE3C`, white, soft gray viewport `#e6e6e6` |
| Extra UX | Browser edit/print/download toolbar for PDF production — **not** part of the product app |
| Pet fields / owner / scans | **Absent** — lorem ipsum only under the NFC mark |

### Reuse vs adapt

| From example | Treatment in TMA app |
|--------------|----------------------|
| Title voice “I'm a safe pet” | Consumer-facing brand lockup on Home (and quiet chrome elsewhere). Package / docs display name remains **I Am A Safe Pet**. |
| Scottie + tabby + bubbles | Port assets; rebuild as responsive Home hero composition (not A4 absolute print units). |
| NFC pictogram | Port SVG; use on Home (and optionally quiet cue on public pet page) to explain tag → phone. |
| Navy / gold / blue tokens | Adopt as CSS variables for the product visual language. |
| Georgia / serif display | **Locked for v1:** Georgia / Times New Roman display stack (match example) + non-default sans for UI (e.g. Source Sans 3). Avoid Inter/Roboto. No Fraunces / alternate display face in v1. |
| White sheet on soft gray | Adapt to full-viewport web atmosphere (soft gray / subtle grain or soft gradient), not a floating A4 card metaphor for every route. |
| Speech-bubble chrome | Allowed on Home as brand storytelling. Do **not** use floating bubbles on the public pet safety page (safety content must stay clear). |
| contenteditable / Print toolbar | **Do not port.** |
| Lorem ipsum block | **Do not port.** Replace with real product CTAs and short supporting copy. |
| A4 `@page` print layout | **Out of v1** — no A4 print route, no print/PDF tooling. Optional future “print tag insert” is a separate effort. |

### Asset source paths (copy during implementation)

Do not require assets in-repo before Task scaffolding; copy when building Home styles:

```
/Users/florentgiovannone/Desktop/safe_pet_page/images/scottie.png
  → apps/i_am_a_safe_pet/public/images/scottie.png

/Users/florentgiovannone/Desktop/safe_pet_page/images/tabby.png
  → apps/i_am_a_safe_pet/public/images/tabby.png

/Users/florentgiovannone/Desktop/safe_pet_page/images/nfc_tap_pictogram.svg
  → apps/i_am_a_safe_pet/public/images/nfc_tap_pictogram.svg
```

Reference in app as `/images/scottie.png`, `/images/tabby.png`, `/images/nfc_tap_pictogram.svg`.

## Product purpose

When a finder scans a QR code or NFC tag on a collar/tag, they land on a **public pet page** with the information needed to handle the animal carefully and reach the owner. Owners use a separate **dashboard** to learn that the pet was scanned or reported found. A **home page** introduces the product using the example’s animal + NFC storytelling.

## Decisions

| Topic | Choice |
|-------|--------|
| Visual reference | `safe_pet_page` for brand, Home composition, palette, NFC pictogram, character art |
| Product surfaces beyond example | Keep prior plan: public pet page fields, owner dashboard, scan/found events |
| Base pattern | Lean Vite + React + React Router app (product shell), not museum/CoE artwork clone, not static A4 HTML |
| Folder / package name | `i_am_a_safe_pet` / `@tma/app-i-am-a-safe-pet` |
| Product display name | I Am A Safe Pet (docs/scripts); Home hero lockup: **I'm a safe pet** |
| Animal model | Generic `pet` with `species` (v1 demo is a dog; Home also shows cat as brand mascot) |
| Public identity | Opaque `publicId` in URL `/pet/:publicId` (QR/NFC target) |
| Data for v1 | Seeded demo pet + browser `localStorage` repository behind a typed interface |
| Backend / Flask | Out of scope for v1; repository seam documents future API shape |
| Owner auth (v1) | Simple demo password gate (`sessionStorage`), not full accounts |
| Scan vs found | Page open → `scan` event; explicit “I found this pet” → `found` event |
| Arkin analytics package | Deferred — product owns owner “was scanned” UX in-app |
| SiteId / `SITE_META` | Deferred for v1 (not an Arkin dashboard scope yet) |
| Languages | English-only for v1 |
| Host (provisional) | `safe-pet.takemearound.gallery` until the real domain is known |
| Display typography (v1) | **Georgia** / Times New Roman stack (match `safe_pet_page`); body: Source Sans 3 |
| Demo pet seed | Name `Mochi`, `publicId` `demo-mochi`, `photoUrl` `/images/scottie.png` (Scottie illustration is placeholder brand art, not a photo of Mochi) |
| Print/PDF / A4 print route | **Out of v1** — no A4 print route, no print/PDF editor from the example |

### Open questions resolved (2026-08-08)

| # | Decision |
|---|----------|
| 1 | **Demo pet photo:** Yes — use Scottie art even though the pet is named Mochi. Seed: name `Mochi`, `publicId` `demo-mochi`, `photoUrl` `/images/scottie.png` (from `safe_pet_page/images/scottie.png`). Illustration is placeholder brand art, **not** a photo of Mochi. |
| 2 | **Display font:** Prefer **Georgia** (match the example). Locked for v1; body Source Sans 3. |
| 3 | **Print tooling:** Out of v1 — no A4 print route, no print/PDF editor. |

## Approaches considered

1. **Museum / CoE clone + Arkin analytics** — Static stop page, NFC scans as Poise logs, owner insight via Arkin dashboard. Fits existing TMA sites, but mismatches the product (pet fields, finder safety copy, owner “my dog was found” UX).
2. **Standalone product app + mock repository (recommended)** — Dedicated routes, typed `PetProfile` / `ScanEvent`, demo data, in-app owner dashboard. Matches requirements; keeps Backend out of v1; clear upgrade path. **Home/brand visuals adapted from `safe_pet_page`.**
3. **Ship the static A4 HTML as the app** — Matches the example file-for-file, but has no pet profile, no scan events, no owner dashboard, and is print-first. Rejected for the product.
4. **Full-stack owner accounts + API** — Real CRUD, auth, notifications. Correct long-term, but Backend is out of scope and would block frontend delivery.

**Recommendation:** Approach 2 for v1, with approach-3 visuals only where they fit (Home brand story).

## Out of scope (v1)

- Real owner account system, email/SMS alerts, or push notifications
- Flask / Backend API persistence (define contract only)
- Pet profile editor UI beyond reading seeded demo data (optional stub “edit” may be listed as future)
- Multi-pet household management UI beyond listing pets owned in the demo seed
- Full `@tma/analytics-*` package and Arkin dashboard scope wiring
- Multi-locale / translation
- Payment, tag ordering, or hardware provisioning flows
- Automated E2E suite (unit tests for data layer + manual smoke are enough)
- A4 print/PDF editing toolbar from the example
- Any A4 print route or print-production tooling (out of v1)
- Using the example’s lorem ipsum as product copy

## Architecture

```
apps/i_am_a_safe_pet/          # new public Vite + React product app
  public/
    images/                    # scottie.png, tabby.png, nfc_tap_pictogram.svg (from example)
  src/
    data/                      # types, seed demo pet, repository interface + localStorage impl
    pages/                     # Home, PublicPet, OwnerDashboard, NotFound, Privacy
    components/                # PetInfoPanel, ScanStatusList/OwnerEventList, HomeBrandScene, shell
    styles/                    # product CSS tokens adapted from example palette
```

Root `package.json` gains:

- `dev:i-am-a-safe-pet`
- `build:i-am-a-safe-pet`
- inclusion in the aggregate `build` script

Netlify: same workspace pattern as other apps (`npm run build -w @tma/app-i-am-a-safe-pet`), path-based `ignore` covering `apps/i_am_a_safe_pet` (and `packages` only if shared packages are later required).

Dev picker (`npm run dev`) auto-discovers the app via `apps/*/package.json` `scripts.dev` — no picker code change required.

### Example → monorepo file mapping

| Example path | Monorepo target | Notes |
|--------------|-----------------|-------|
| `index.html` (structure/CSS ideas) | `src/pages/HomePage.tsx` + `src/styles/app.css` | Recompose; do not keep A4 absolute cm layout as the app shell |
| `images/scottie.png` | `public/images/scottie.png` | Home brand scene **and** demo pet `photoUrl` (placeholder brand art for Mochi — not a real pet photo) |
| `images/tabby.png` | `public/images/tabby.png` | Home brand scene (mascot pair) |
| `images/nfc_tap_pictogram.svg` | `public/images/nfc_tap_pictogram.svg` | Home NFC cue; optional quiet mark on public page |
| Inline `:root` knobs / palette | `src/styles/app.css` CSS variables | Web units (`rem`/`vh`), not print `cm`/`pt` for product UI |
| Speech bubble markup | `src/components/HomeBrandScene.tsx` (or inline in Home) | Brand-only |
| Toolbar JS | — | Omit |
| *(missing in example)* public fields | `PetInfoPanel.tsx` + `PublicPetPage.tsx` | From prior TMA product requirements |
| *(missing in example)* owner/scans | `OwnerDashboardPage.tsx` + repository | From prior TMA product requirements |

## Roles

| Role | Auth | Capabilities |
|------|------|----------------|
| Finder | None | Open public pet page; read safety/contact fields; optionally tap “I found this pet” |
| Owner | Demo password (v1) | See owned pets; see scan/found event timeline; know last seen time |
| Anonymous visitor | None | Home / privacy / marketing only |

## App pages & routes

| Path | Purpose |
|------|---------|
| `/` | Product home — example-inspired brand scene + CTAs to demo pet + owner dashboard |
| `/pet/:publicId` | Public finder view (QR/NFC landing) |
| `/owner` | Owner dashboard with inline password gate, then scan/found activity |
| `/privacy-policy` | Privacy note (public contact fields are intentional for lost-pet recovery) |
| `/allpages` | Dev index of available pages |
| `*` | Not found |

No `/dashboard` redirect to Arkin in v1 (that pattern is for museum analytics scopes). Owner product surface is `/owner`.

### Home page (aligned to example)

One composition, brand-first:

1. Hero brand lockup: **I'm a safe pet** (serif, large — must remain the strongest text signal).
2. Animal row: Scottie + Tabby with the example speech bubbles (responsive: stack or scale; preserve playful dialogue).
3. Centered NFC pictogram with one short line explaining “Tap or scan the tag on a collar.”
4. One headline-scale supporting sentence (not louder than the brand), e.g. finder reassurance / product promise.
5. CTA group: **View demo pet** → `/pet/demo-mochi`, **Owner dashboard** → `/owner`.

Constraints (frontend design rules):

- First viewport = one composition, not a dashboard.
- No card grid, stats strip, or promo chips on Home.
- Do not overlay detached badges on the animal art.
- Motions: subtle entrance for animals/bubbles/NFC (2–3 intentional motions), not noise.
- Soft gray / atmospheric background from the example’s viewport feel; white content plane for readability — adapted for mobile full-bleed, not a tiny floating A4 sheet.

### Public pet page (finder) — product requirement (not in example)

Required labeled fields:

- **My name is:** `pet.name`
- **Owner name:** `pet.ownerName`
- **Contact number:** `pet.contactNumber` (tel link)
- **Animal's personality:** `pet.personality` — safety-critical free text (e.g. wary of strangers/men, fluorescent clothing, not to be left with children). Render prominently (not buried).
- **Allergies:** `pet.allergies`
- **Vets contact details:** `pet.vetContact`

Also show:

- Pet photo when `photoUrl` is set — **demo seed always sets** `photoUrl: "/images/scottie.png"` (Scottie illustration is placeholder brand art, not a photo of Mochi; alt text may still use the pet name)
- Species / breed line (secondary)
- Primary CTA: **I found this pet** (records `found` event)
- Short reassurance copy for the finder
- Quiet footer link to home / privacy
- Optional small NFC pictogram as a quiet brand cue (never competing with personality)

Visual inheritance from example: same CSS tokens (navy/gold/blue), serif pet name, calm white/gray reading surface. **No speech bubbles** on this route — safety readability wins.

On successful load (known `publicId`), record a `scan` event once per browser session per pet (debounce so React Strict Mode / remounts do not spam). Unknown `publicId` → dedicated empty/not-found state (no scan recorded).

### Owner dashboard — product requirement (not in example)

After demo password:

- List owned pets from seed (v1: one demo dog)
- Per pet: last scan time, last found time, chronological event list (newest first)
- Empty state when no events yet
- Sign out clears session

Visual inheritance: same tokens and typography; functional list UI (events are interaction content — plain rows, not marketing bubbles).

## Data model

### `PetProfile`

```ts
type PetId = string
type PublicPetId = string

type PetProfile = {
  id: PetId
  publicId: PublicPetId
  name: string
  species: "dog" | "cat" | "other"
  breed?: string
  ownerName: string
  contactNumber: string
  personality: string
  allergies: string
  vetContact: string
  photoUrl?: string
  ownerAccountId: string
}
```

### `PetEvent` (scan / found)

```ts
type PetEventType = "scan" | "found"

type PetEvent = {
  id: string
  petId: PetId
  publicId: PublicPetId
  type: PetEventType
  createdAt: string // ISO-8601
  source: "page_view" | "finder_cta"
  userAgent?: string
}
```

### Repository interface (v1 local, future API)

```ts
interface SafePetRepository {
  getPetByPublicId(publicId: string): Promise<PetProfile | null>
  listPetsForOwner(ownerAccountId: string): Promise<PetProfile[]>
  listEventsForPet(petId: string): Promise<PetEvent[]>
  listEventsForOwner(ownerAccountId: string): Promise<PetEvent[]>
  recordEvent(input: Omit<PetEvent, "id" | "createdAt"> & { createdAt?: string }): Promise<PetEvent>
}
```

v1 implementation: `LocalSafePetRepository` using in-memory seed pets + `localStorage` for events (key namespaced, e.g. `tma-safe-pet-events-v1`).

Demo seed (**locked** constants):

- Pet name: `Mochi`
- `publicId`: `demo-mochi`
- `photoUrl`: `/images/scottie.png` — copied at implementation from `/Users/florentgiovannone/Desktop/safe_pet_page/images/scottie.png`. Illustration is placeholder brand art, **not** a photo of Mochi.
- Owner demo password env: `VITE_OWNER_DEMO_PASSWORD` (default documented in `.env.example`)
- Owner account id: `demo-owner`

## Visual language (tokens)

```css
:root {
  --safe-pet-navy: #122042;
  --safe-pet-deep-blue: #1C448C;
  --safe-pet-bright-blue: #0084FF;
  --safe-pet-gold: #F0BE3C;
  --safe-pet-ink: #222222;
  --safe-pet-paper: #ffffff;
  --safe-pet-atmosphere: #e6e6e6; /* example viewport; may deepen with subtle gradient */
  --safe-pet-font-display: Georgia, "Times New Roman", serif; /* locked for v1 — match example */
  --safe-pet-font-body: "Source Sans 3", "Source Sans Pro", sans-serif;
}
```

Avoid: purple-indigo AI defaults, cream+terracotta newspaper tropes, Inter/Roboto as the brand face, museum/CoE chrome.

## QR / NFC → public page flow

```
[Tag / QR] → https://safe-pet.takemearound.gallery/pet/{publicId}
           → App loads PublicPetPage
           → repository.getPetByPublicId
           → if found: render fields + recordEvent(type: "scan", source: "page_view")
           → finder may tap CTA → recordEvent(type: "found", source: "finder_cta")
           → owner opens /owner → sees events for that pet
```

Physical tag programming is out of band: tags must be encoded to the public URL. No in-app NFC write in v1. Home’s NFC pictogram educates; it does not write tags.

## Platform plug-in (TMA monorepo)

| Integration | v1 action |
|-------------|-----------|
| `apps/i_am_a_safe_pet` | Create app |
| Root scripts / aggregate `build` | Add shortcuts |
| `scripts/dev.mjs` discovery | Automatic via `package.json` |
| README Netlify table | Add row |
| `@tma/config` SiteId | Deferred |
| `@tma/analytics-*` | Deferred |
| `apps/dashboard` Arkin scope | Deferred |
| Backend API | Deferred; keep repository interface stable |

## Errors & empty states

- Unknown `publicId` → “Pet not found” (no PII, no events)
- Owner wrong password → inline error
- No events yet → dashboard empty copy (“No scans yet — events appear when someone opens your pet’s page”)
- `localStorage` unavailable → fall back to in-memory events for the session; show a subtle warning on dashboard if persistence failed

## Verification

- `npm run build -w @tma/app-i-am-a-safe-pet` succeeds
- Unit tests for repository / event recording (Node or Vitest — prefer Vitest in-app or small pure modules testable via `node:test` if kept dependency-free)
- Manual smoke: home (brand scene + CTAs), `/pet/demo-mochi`, unknown pet, owner login, scan appears after page view, found CTA appears as `found`
- Visual check: Home reads as the example’s brand story on mobile and desktop (responsive, not literal A4)

## Implementation notes

1. Do not copy museum artwork pages, audio players, or CoE church assets.
2. Do not ship the example’s edit/print toolbar, A4-only layout, or any A4 print route in v1.
3. Personality must be visually primary on the public page — treat as safety content, not a footnote.
4. Keep the repository interface small so a later Flask client can swap in without route rewrites.
5. Provisional host string appears in README / app README only until SiteId wiring exists.
6. Privacy policy should state that contact details are shown to finders by design for lost-pet recovery.
7. Prefer documenting + copying assets in the Home/styles task; large PNGs (~1.7MB / ~3.1MB) stay as static `public/` files.
