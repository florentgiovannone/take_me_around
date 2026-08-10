# I Am A Safe Pet App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `apps/i_am_a_safe_pet` as a standalone lost-pet product app with a marketing home inspired by `safe_pet_page`, a public finder pet page (QR/NFC), and an owner dashboard showing scan/found events.

**Architecture:** Lean Vite/React/React Router app (not a museum shell clone, not a static A4 HTML port). Typed `PetProfile` / `PetEvent` models with a `SafePetRepository` interface backed by seeded demo data + `localStorage` events. Finder page views record `scan`; an explicit CTA records `found`. Owner area uses a demo password gate. Home brand scene ports characters, speech bubbles, NFC pictogram, and palette from the Desktop example.

**Tech Stack:** npm workspaces, Vite 8, React 19, React Router 7, TypeScript, CSS (app-local), Vitest (app-local), Netlify redirects plugin pattern.

**Spec:** `docs/superpowers/specs/2026-08-08-i-am-a-safe-pet-app-design.md`  
**Visual example:** `/Users/florentgiovannone/Desktop/safe_pet_page`

## Design reference decisions (locked)

| Adopt from `safe_pet_page` | Keep from prior TMA plan |
|----------------------------|--------------------------|
| Home brand lockup **I'm a safe pet** | Routes `/`, `/pet/:publicId`, `/owner`, `/privacy-policy`, `/allpages` |
| Scottie + tabby cutouts + bubble copy | Required public fields (name, owner, contact, personality, allergies, vet) |
| NFC tap SVG pictogram | `scan` on view + `found` CTA + owner dashboard |
| Navy / gold / blue CSS tokens | Vite/React/TS monorepo app + repository seam |
| Soft gray atmosphere + white reading surface | Demo password gate, localStorage events |
| **Georgia** display stack (match example; not Fraunces in v1) | English-only; no Arkin/SiteId in v1 |

**Do not port:** contenteditable toolbar, Print/PDF A4 absolute `cm` layout as app shell, A4 print route, lorem ipsum body copy.

### Open questions resolved (2026-08-08)

| # | Decision |
|---|----------|
| 1 | **Demo pet photo:** Use Scottie art even though the pet is named Mochi. Seed: name `Mochi`, `publicId` `demo-mochi`, `photoUrl` `/images/scottie.png` (copied from `/Users/florentgiovannone/Desktop/safe_pet_page/images/scottie.png`). Illustration is placeholder brand art, **not** a photo of Mochi. |
| 2 | **Display font:** Prefer **Georgia** (match the example). Locked for v1 with Times New Roman fallback; body remains Source Sans 3. |
| 3 | **Print tooling:** Out of v1 — no A4 print route, no print/PDF editor. |

## Global Constraints

- App folder: `apps/i_am_a_safe_pet`; package name: `@tma/app-i-am-a-safe-pet`
- Product display name (docs/scripts): `I Am A Safe Pet`; Home hero lockup: `I'm a safe pet`
- Demo pet: name `Mochi`, `publicId` `demo-mochi`, `photoUrl` `/images/scottie.png` (placeholder brand art, not a photo of Mochi); demo owner account id: `demo-owner`
- Display font: Georgia / Times New Roman (match example); body Source Sans 3 — no Fraunces swap in v1
- Owner password: read `import.meta.env.VITE_OWNER_DEMO_PASSWORD` with fallback `"safe-pet-demo"`
- Routes: `/`, `/pet/:publicId`, `/owner`, `/privacy-policy`, `/allpages`, `*` — **no** A4 print route
- Do **not** add `@tma/config` SiteId, analytics packages, or Arkin dashboard routes in v1
- Do **not** copy museum/CoE artwork, audio, or church assets
- Do **not** copy the example’s edit/print toolbar or any print-production tooling into the product (out of v1)
- English-only; Backend/Flask out of scope
- Provisional host (docs only): `safe-pet.takemearound.gallery`
- Commit after each task with a concise message

## File structure (locked)

| Path | Responsibility |
|------|----------------|
| `apps/i_am_a_safe_pet/package.json` | Workspace package + scripts |
| `apps/i_am_a_safe_pet/vite.config.ts` | Vite + SPA `_redirects` + optional `/api` proxy stub |
| `apps/i_am_a_safe_pet/netlify.toml` | Netlify build/publish/ignore |
| `apps/i_am_a_safe_pet/index.html` | HTML shell + font links |
| `apps/i_am_a_safe_pet/public/images/scottie.png` | From example |
| `apps/i_am_a_safe_pet/public/images/tabby.png` | From example |
| `apps/i_am_a_safe_pet/public/images/nfc_tap_pictogram.svg` | From example |
| `apps/i_am_a_safe_pet/src/main.tsx` | React root + BrowserRouter |
| `apps/i_am_a_safe_pet/src/App.tsx` | Routes + page titles |
| `apps/i_am_a_safe_pet/src/data/types.ts` | `PetProfile`, `PetEvent`, repository types |
| `apps/i_am_a_safe_pet/src/data/seed.ts` | Demo pet + constants |
| `apps/i_am_a_safe_pet/src/data/scanSession.ts` | Per-session scan dedupe helpers |
| `apps/i_am_a_safe_pet/src/data/localRepository.ts` | `LocalSafePetRepository` |
| `apps/i_am_a_safe_pet/src/data/repository.ts` | Default repository singleton |
| `apps/i_am_a_safe_pet/src/pages/HomePage.tsx` | Example-inspired brand home |
| `apps/i_am_a_safe_pet/src/pages/PublicPetPage.tsx` | Finder view + events |
| `apps/i_am_a_safe_pet/src/pages/OwnerDashboardPage.tsx` | Password gate + activity |
| `apps/i_am_a_safe_pet/src/pages/PrivacyPolicyPage.tsx` | Privacy copy |
| `apps/i_am_a_safe_pet/src/pages/NotFoundPage.tsx` | 404 |
| `apps/i_am_a_safe_pet/src/components/HomeBrandScene.tsx` | Animals + bubbles + NFC scene |
| `apps/i_am_a_safe_pet/src/components/PetInfoPanel.tsx` | Labeled public fields |
| `apps/i_am_a_safe_pet/src/components/OwnerEventList.tsx` | Event timeline |
| `apps/i_am_a_safe_pet/src/styles/app.css` | Tokens from example + product styles |
| `apps/i_am_a_safe_pet/src/data/*.test.ts` | Vitest unit tests |
| Root `package.json`, `README.md` | Scripts + Netlify table |
| `apps/i_am_a_safe_pet/README.md` | App-local docs |

### Asset copy commands (used in Task 5)

```bash
mkdir -p apps/i_am_a_safe_pet/public/images
cp /Users/florentgiovannone/Desktop/safe_pet_page/images/scottie.png \
   apps/i_am_a_safe_pet/public/images/scottie.png
cp /Users/florentgiovannone/Desktop/safe_pet_page/images/tabby.png \
   apps/i_am_a_safe_pet/public/images/tabby.png
cp /Users/florentgiovannone/Desktop/safe_pet_page/images/nfc_tap_pictogram.svg \
   apps/i_am_a_safe_pet/public/images/nfc_tap_pictogram.svg
```

---

### Task 1: Scaffold `@tma/app-i-am-a-safe-pet` package

**Files:**
- Create: `apps/i_am_a_safe_pet/package.json`
- Create: `apps/i_am_a_safe_pet/tsconfig.json`
- Create: `apps/i_am_a_safe_pet/tsconfig.app.json`
- Create: `apps/i_am_a_safe_pet/tsconfig.node.json`
- Create: `apps/i_am_a_safe_pet/vite.config.ts`
- Create: `apps/i_am_a_safe_pet/index.html`
- Create: `apps/i_am_a_safe_pet/src/main.tsx`
- Create: `apps/i_am_a_safe_pet/src/App.tsx`
- Create: `apps/i_am_a_safe_pet/src/vite-env.d.ts`
- Create: `apps/i_am_a_safe_pet/src/styles/app.css` (tokens placeholder from example palette)
- Create: `apps/i_am_a_safe_pet/.env.example`
- Create: `apps/i_am_a_safe_pet/.gitignore`
- Create: `apps/i_am_a_safe_pet/netlify.toml`
- Create: `apps/i_am_a_safe_pet/public/favicon.png` (copy from `apps/church_of_england/public/favicon.png` or any existing app favicon)
- Create: `apps/i_am_a_safe_pet/src/pages/NotFoundPage.tsx` (stub)

**Interfaces:**
- Produces: runnable workspace `@tma/app-i-am-a-safe-pet` with `dev` / `build` / `test` scripts

- [x] **Step 1: Create `package.json`**

```json
{
  "name": "@tma/app-i-am-a-safe-pet",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --open",
    "build": "tsc --noEmit -p tsconfig.app.json && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "react": "^19.2.5",
    "react-dom": "^19.2.5",
    "react-router-dom": "^7.14.2"
  },
  "devDependencies": {
    "@types/node": "^25.9.3",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "typescript": "^5.9.3",
    "vite": "^8.0.10",
    "vitest": "^3.2.4"
  }
}
```

- [x] **Step 2: Create Vite + TS configs**

`vite.config.ts`:

```ts
import fs from "node:fs"
import path from "node:path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => {
  const fileEnv = loadEnv(mode, process.cwd(), "")
  const proxyBase = (
    process.env.VITE_API_PROXY_TARGET ||
    process.env.VITE_API_BASE_URL ||
    fileEnv.VITE_API_PROXY_TARGET ||
    fileEnv.VITE_API_BASE_URL ||
    ""
  )
    .trim()
    .replace(/\/$/, "")
  const apiTarget = proxyBase || "http://127.0.0.1:5050"

  return {
    plugins: [
      react(),
      {
        name: "netlify-redirects",
        closeBundle() {
          const lines: string[] = []
          if (proxyBase) {
            lines.push(`/api/*  ${proxyBase}/api/:splat  200`)
          }
          lines.push("/*    /index.html   200")
          const out = path.resolve(process.cwd(), "dist", "_redirects")
          fs.mkdirSync(path.dirname(out), { recursive: true })
          fs.writeFileSync(out, `${lines.join("\n")}\n`)
        },
      },
    ],
    test: {
      environment: "node",
    },
    server: {
      host: true,
      allowedHosts: true,
      fs: {
        allow: [path.resolve(__dirname, "../..")],
      },
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "types": ["vitest/globals"]
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

`tsconfig.app.json`:

```json
{
  "extends": "./tsconfig.json",
  "include": ["src"],
  "exclude": ["src/**/*.test.ts"]
}
```

`tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noEmit": true
  },
  "include": ["vite.config.ts"]
}
```

- [x] **Step 3: Create HTML entry, bootstrap, stub App**

`index.html` — standard Vite React shell; document title `I Am A Safe Pet`. Load **Source Sans 3** (body) via Google Fonts. Display face: **Georgia** / Times New Roman stack (matches example; locked for v1); do **not** use Inter/Roboto or Fraunces in v1.

`src/vite-env.d.ts`:

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_PROXY_TARGET?: string
  readonly VITE_API_BASE_URL?: string
  readonly VITE_OWNER_DEMO_PASSWORD?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

`src/main.tsx`:

```tsx
import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import "./styles/app.css"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
```

`src/App.tsx` (temporary stub — expanded in later tasks):

```tsx
import { Route, Routes } from "react-router-dom"
import NotFoundPage from "./pages/NotFoundPage"

function HomeStub() {
  return (
    <main>
      <h1>I&rsquo;m a safe pet</h1>
      <p>Scaffold OK</p>
    </main>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeStub />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
```

`src/pages/NotFoundPage.tsx`:

```tsx
import { Link } from "react-router-dom"

export default function NotFoundPage() {
  return (
    <main className="safe-pet-page">
      <h1>Page not found</h1>
      <p>
        <Link to="/">Back home</Link>
      </p>
    </main>
  )
}
```

`src/styles/app.css` (token stub — expand in Task 5):

```css
:root {
  --safe-pet-navy: #122042;
  --safe-pet-deep-blue: #1c448c;
  --safe-pet-bright-blue: #0084ff;
  --safe-pet-gold: #f0be3c;
  --safe-pet-ink: #222222;
  --safe-pet-paper: #ffffff;
  --safe-pet-atmosphere: #e6e6e6;
  --safe-pet-font-display: Georgia, "Times New Roman", serif;
  --safe-pet-font-body: "Source Sans 3", "Source Sans Pro", sans-serif;
}

body {
  margin: 0;
  font-family: var(--safe-pet-font-body);
  color: var(--safe-pet-ink);
  background: var(--safe-pet-atmosphere);
}
```

`.env.example`:

```
VITE_API_PROXY_TARGET=
VITE_OWNER_DEMO_PASSWORD=safe-pet-demo
```

`.gitignore`:

```
node_modules
dist
.env
.env.local
*.local
```

`netlify.toml`:

```toml
[build]
  command = "cd \"$(git rev-parse --show-toplevel)\" && npm ci && npm run build -w @tma/app-i-am-a-safe-pet"
  publish = "apps/i_am_a_safe_pet/dist"
  ignore = "git diff --quiet $CACHED_COMMIT_REF $COMMIT_REF -- apps/i_am_a_safe_pet"
```

Copy favicon from an existing app:

```bash
cp apps/church_of_england/public/favicon.png apps/i_am_a_safe_pet/public/favicon.png
```

- [x] **Step 4: Install workspace deps and verify build**

From repo root:

```bash
npm install
npm run build -w @tma/app-i-am-a-safe-pet
```

Expected: build succeeds; `apps/i_am_a_safe_pet/dist` created.

- [x] **Step 5: Commit**

```bash
git add apps/i_am_a_safe_pet package-lock.json
git commit -m "$(cat <<'EOF'
Scaffold i_am_a_safe_pet Vite app workspace.

EOF
)"
```

---

### Task 2: Types, seed, scan-session helper + tests

**Files:**
- Create: `apps/i_am_a_safe_pet/src/data/types.ts`
- Create: `apps/i_am_a_safe_pet/src/data/seed.ts`
- Create: `apps/i_am_a_safe_pet/src/data/scanSession.ts`
- Create: `apps/i_am_a_safe_pet/src/data/scanSession.test.ts`

**Interfaces:**
- Produces:
  - `PetProfile`, `PetEvent`, `PetEventType`, `SafePetRepository`
  - `DEMO_OWNER_ACCOUNT_ID`, `DEMO_PET_PUBLIC_ID`, `DEMO_PETS`
  - `scanSessionKey(publicId)`, `hasRecordedScanThisSession(storage, publicId)`, `markScanRecordedThisSession(storage, publicId)`

- [x] **Step 1: Write failing tests for scan session dedupe**

`src/data/scanSession.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import {
  hasRecordedScanThisSession,
  markScanRecordedThisSession,
  scanSessionKey,
} from "./scanSession"

describe("scanSession", () => {
  it("builds a namespaced key", () => {
    expect(scanSessionKey("demo-mochi")).toBe("tma-safe-pet-scan-session:demo-mochi")
  })

  it("marks and detects a recorded scan in session storage", () => {
    const storage = new Map<string, string>()
    const shim: Storage = {
      get length() {
        return storage.size
      },
      clear() {
        storage.clear()
      },
      getItem(key) {
        return storage.has(key) ? storage.get(key)! : null
      },
      key() {
        return null
      },
      removeItem(key) {
        storage.delete(key)
      },
      setItem(key, value) {
        storage.set(key, value)
      },
    }

    expect(hasRecordedScanThisSession(shim, "demo-mochi")).toBe(false)
    markScanRecordedThisSession(shim, "demo-mochi")
    expect(hasRecordedScanThisSession(shim, "demo-mochi")).toBe(true)
  })
})
```

- [x] **Step 2: Run test to verify it fails**

```bash
npm run test -w @tma/app-i-am-a-safe-pet
```

Expected: FAIL — module `./scanSession` missing.

- [x] **Step 3: Implement types, seed, scanSession**

`src/data/types.ts`:

```ts
export type PetId = string
export type PublicPetId = string

export type PetProfile = {
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

export type PetEventType = "scan" | "found"

export type PetEvent = {
  id: string
  petId: PetId
  publicId: PublicPetId
  type: PetEventType
  createdAt: string
  source: "page_view" | "finder_cta"
  userAgent?: string
}

export type SafePetRepository = {
  getPetByPublicId(publicId: string): Promise<PetProfile | null>
  listPetsForOwner(ownerAccountId: string): Promise<PetProfile[]>
  listEventsForPet(petId: string): Promise<PetEvent[]>
  listEventsForOwner(ownerAccountId: string): Promise<PetEvent[]>
  recordEvent(
    input: Omit<PetEvent, "id" | "createdAt"> & { createdAt?: string }
  ): Promise<PetEvent>
}
```

`src/data/seed.ts`:

```ts
import type { PetProfile } from "./types"

export const DEMO_OWNER_ACCOUNT_ID = "demo-owner"
export const DEMO_PET_PUBLIC_ID = "demo-mochi"

export const DEMO_PETS: PetProfile[] = [
  {
    id: "pet-mochi",
    publicId: DEMO_PET_PUBLIC_ID,
    name: "Mochi",
    species: "dog",
    breed: "Mixed",
    ownerName: "Alex Rivera",
    contactNumber: "+44 7700 900123",
    personality:
      "Wary of strangers and men in particular. Startled by fluorescent clothing. Do not leave alone with young children. Approach slowly, speak softly, and let Mochi come to you.",
    allergies: "Chicken; avoid treats containing poultry.",
    vetContact: "Greenfield Vets — 01234 567890 — 14 High Street",
    photoUrl: "/images/scottie.png", // locked: Scottie brand art for demo pet Mochi
    ownerAccountId: DEMO_OWNER_ACCOUNT_ID,
  },
]
```

Note (locked): `photoUrl` is the example Scottie illustration — placeholder brand art, **not** a photo of Mochi. Home still shows both Scottie and Tabby as brand mascots (not as the same pet profile).

`src/data/scanSession.ts`:

```ts
export function scanSessionKey(publicId: string): string {
  return `tma-safe-pet-scan-session:${publicId}`
}

export function hasRecordedScanThisSession(
  storage: Storage,
  publicId: string
): boolean {
  return storage.getItem(scanSessionKey(publicId)) === "1"
}

export function markScanRecordedThisSession(
  storage: Storage,
  publicId: string
): void {
  storage.setItem(scanSessionKey(publicId), "1")
}
```

- [x] **Step 4: Run tests to verify they pass**

```bash
npm run test -w @tma/app-i-am-a-safe-pet
```

Expected: PASS.

- [x] **Step 5: Commit**

```bash
git add apps/i_am_a_safe_pet/src/data
git commit -m "$(cat <<'EOF'
Add safe-pet types, demo seed, and scan session helpers.

EOF
)"
```

---

### Task 3: Local repository + tests

**Files:**
- Create: `apps/i_am_a_safe_pet/src/data/localRepository.ts`
- Create: `apps/i_am_a_safe_pet/src/data/localRepository.test.ts`
- Create: `apps/i_am_a_safe_pet/src/data/repository.ts`

**Interfaces:**
- Consumes: `PetProfile`, `PetEvent`, `SafePetRepository`, `DEMO_PETS`
- Produces:
  - `createLocalSafePetRepository(options?)`
  - `getSafePetRepository()` default singleton
  - Events key: `tma-safe-pet-events-v1`

- [x] **Step 1: Write failing repository tests**

```ts
import { beforeEach, describe, expect, it } from "vitest"
import { createLocalSafePetRepository } from "./localRepository"
import { DEMO_OWNER_ACCOUNT_ID, DEMO_PET_PUBLIC_ID } from "./seed"

function memoryStorage(): Storage {
  const map = new Map<string, string>()
  return {
    get length() {
      return map.size
    },
    clear() {
      map.clear()
    },
    getItem(key) {
      return map.has(key) ? map.get(key)! : null
    },
    key() {
      return null
    },
    removeItem(key) {
      map.delete(key)
    },
    setItem(key, value) {
      map.set(key, value)
    },
  }
}

describe("createLocalSafePetRepository", () => {
  let storage: Storage

  beforeEach(() => {
    storage = memoryStorage()
  })

  it("returns the demo pet by publicId", async () => {
    const repo = createLocalSafePetRepository({ storage })
    const pet = await repo.getPetByPublicId(DEMO_PET_PUBLIC_ID)
    expect(pet?.name).toBe("Mochi")
  })

  it("returns null for unknown publicId", async () => {
    const repo = createLocalSafePetRepository({ storage })
    expect(await repo.getPetByPublicId("nope")).toBeNull()
  })

  it("records scan and found events for the owner", async () => {
    const repo = createLocalSafePetRepository({ storage })
    const pet = await repo.getPetByPublicId(DEMO_PET_PUBLIC_ID)
    expect(pet).not.toBeNull()

    await repo.recordEvent({
      petId: pet!.id,
      publicId: pet!.publicId,
      type: "scan",
      source: "page_view",
    })
    await repo.recordEvent({
      petId: pet!.id,
      publicId: pet!.publicId,
      type: "found",
      source: "finder_cta",
    })

    const events = await repo.listEventsForOwner(DEMO_OWNER_ACCOUNT_ID)
    expect(events).toHaveLength(2)
    expect(events[0].type).toBe("found")
    expect(events[1].type).toBe("scan")
  })
})
```

- [x] **Step 2: Run test to verify it fails**

```bash
npm run test -w @tma/app-i-am-a-safe-pet
```

Expected: FAIL — `localRepository` missing.

- [x] **Step 3: Implement repository**

`src/data/localRepository.ts`:

```ts
import { DEMO_PETS } from "./seed"
import type { PetEvent, PetProfile, SafePetRepository } from "./types"

const EVENTS_KEY = "tma-safe-pet-events-v1"

export type LocalRepoOptions = {
  storage?: Storage
  pets?: PetProfile[]
  now?: () => Date
  createId?: () => string
}

function readEvents(storage: Storage): PetEvent[] {
  try {
    const raw = storage.getItem(EVENTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as PetEvent[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeEvents(storage: Storage, events: PetEvent[]): void {
  storage.setItem(EVENTS_KEY, JSON.stringify(events))
}

export function createLocalSafePetRepository(
  options: LocalRepoOptions = {}
): SafePetRepository {
  const pets = options.pets ?? DEMO_PETS
  const storage =
    options.storage ??
    (typeof localStorage !== "undefined" ? localStorage : undefined)
  const memoryFallback: PetEvent[] = []
  const now = options.now ?? (() => new Date())
  const createId =
    options.createId ?? (() => crypto.randomUUID())

  function loadEvents(): PetEvent[] {
    if (!storage) return [...memoryFallback]
    return readEvents(storage)
  }

  function saveEvents(events: PetEvent[]): void {
    if (!storage) {
      memoryFallback.length = 0
      memoryFallback.push(...events)
      return
    }
    writeEvents(storage, events)
  }

  return {
    async getPetByPublicId(publicId) {
      return pets.find((p) => p.publicId === publicId) ?? null
    },
    async listPetsForOwner(ownerAccountId) {
      return pets.filter((p) => p.ownerAccountId === ownerAccountId)
    },
    async listEventsForPet(petId) {
      return loadEvents()
        .filter((e) => e.petId === petId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    },
    async listEventsForOwner(ownerAccountId) {
      const ownedIds = new Set(
        pets.filter((p) => p.ownerAccountId === ownerAccountId).map((p) => p.id)
      )
      return loadEvents()
        .filter((e) => ownedIds.has(e.petId))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    },
    async recordEvent(input) {
      const event: PetEvent = {
        id: createId(),
        petId: input.petId,
        publicId: input.publicId,
        type: input.type,
        source: input.source,
        userAgent: input.userAgent,
        createdAt: input.createdAt ?? now().toISOString(),
      }
      const next = [event, ...loadEvents()]
      saveEvents(next)
      return event
    },
  }
}
```

`src/data/repository.ts`:

```ts
import { createLocalSafePetRepository } from "./localRepository"
import type { SafePetRepository } from "./types"

let singleton: SafePetRepository | null = null

export function getSafePetRepository(): SafePetRepository {
  if (!singleton) singleton = createLocalSafePetRepository()
  return singleton
}

/** Test helper */
export function __resetSafePetRepositoryForTests(): void {
  singleton = null
}
```

- [x] **Step 4: Run tests**

```bash
npm run test -w @tma/app-i-am-a-safe-pet
```

Expected: PASS.

- [x] **Step 5: Commit**

```bash
git add apps/i_am_a_safe_pet/src/data
git commit -m "$(cat <<'EOF'
Add local safe-pet repository with event persistence.

EOF
)"
```

---

### Task 4: Public pet page + PetInfoPanel

**Files:**
- Create: `apps/i_am_a_safe_pet/src/components/PetInfoPanel.tsx`
- Create: `apps/i_am_a_safe_pet/src/pages/PublicPetPage.tsx`
- Modify: `apps/i_am_a_safe_pet/src/App.tsx`

**Interfaces:**
- Consumes: `getSafePetRepository()`, scan session helpers, `PetProfile`
- Produces: route `/pet/:publicId` that records one `scan` per session and CTA `found`
- Visual: example tokens (navy/gold); **no** speech bubbles on this route

- [x] **Step 1: Implement `PetInfoPanel`**

Render these labels exactly (colon included in label text as UX copy):

- My name is:
- Owner name:
- Contact number: (`<a href="tel:...">`)
- Animal's personality: (use a visually primary block, e.g. class `safe-pet-personality`)
- Allergies:
- Vets contact details:

```tsx
import type { PetProfile } from "../data/types"

export default function PetInfoPanel({ pet }: { pet: PetProfile }) {
  return (
    <dl className="safe-pet-info">
      <div>
        <dt>My name is:</dt>
        <dd>{pet.name}</dd>
      </div>
      <div>
        <dt>Owner name:</dt>
        <dd>{pet.ownerName}</dd>
      </div>
      <div>
        <dt>Contact number:</dt>
        <dd>
          <a href={`tel:${pet.contactNumber.replace(/\s+/g, "")}`}>
            {pet.contactNumber}
          </a>
        </dd>
      </div>
      <div className="safe-pet-personality">
        <dt>Animal&apos;s personality:</dt>
        <dd>{pet.personality}</dd>
      </div>
      <div>
        <dt>Allergies:</dt>
        <dd>{pet.allergies}</dd>
      </div>
      <div>
        <dt>Vets contact details:</dt>
        <dd>{pet.vetContact}</dd>
      </div>
    </dl>
  )
}
```

- [x] **Step 2: Implement `PublicPetPage`**

Behavior:

1. Read `publicId` from route params.
2. Load pet via repository.
3. If missing → “Pet not found” (no event).
4. If found → render panel; in `useEffect`, if `sessionStorage` has not recorded this `publicId`, call `recordEvent({ type: "scan", source: "page_view", ... })` then `markScanRecordedThisSession`.
5. Button “I found this pet” → `recordEvent({ type: "found", source: "finder_cta", ... })` and show confirmation state.
6. If `pet.photoUrl` present, show photo above or beside the name (not as a floating badge overlay).

```tsx
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import PetInfoPanel from "../components/PetInfoPanel"
import { getSafePetRepository } from "../data/repository"
import {
  hasRecordedScanThisSession,
  markScanRecordedThisSession,
} from "../data/scanSession"
import type { PetProfile } from "../data/types"

export default function PublicPetPage() {
  const { publicId = "" } = useParams()
  const [pet, setPet] = useState<PetProfile | null | undefined>(undefined)
  const [foundConfirm, setFoundConfirm] = useState(false)
  const [recordingFound, setRecordingFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    const repo = getSafePetRepository()
    void repo.getPetByPublicId(publicId).then(async (result) => {
      if (cancelled) return
      setPet(result)
      if (!result) return
      if (hasRecordedScanThisSession(sessionStorage, result.publicId)) return
      await repo.recordEvent({
        petId: result.id,
        publicId: result.publicId,
        type: "scan",
        source: "page_view",
        userAgent: navigator.userAgent,
      })
      markScanRecordedThisSession(sessionStorage, result.publicId)
    })
    return () => {
      cancelled = true
    }
  }, [publicId])

  async function onFound() {
    if (!pet || recordingFound) return
    setRecordingFound(true)
    await getSafePetRepository().recordEvent({
      petId: pet.id,
      publicId: pet.publicId,
      type: "found",
      source: "finder_cta",
      userAgent: navigator.userAgent,
    })
    setFoundConfirm(true)
    setRecordingFound(false)
  }

  if (pet === undefined) {
    return (
      <main className="safe-pet-page">
        <p>Loading…</p>
      </main>
    )
  }

  if (pet === null) {
    return (
      <main className="safe-pet-page">
        <h1>Pet not found</h1>
        <p>This tag is not linked to a pet profile.</p>
        <p>
          <Link to="/">Back home</Link>
        </p>
      </main>
    )
  }

  return (
    <main className="safe-pet-page safe-pet-public">
      <p className="safe-pet-kicker">You found me</p>
      <h1 className="safe-pet-display">{pet.name}</h1>
      {pet.photoUrl ? (
        <img
          className="safe-pet-photo"
          src={pet.photoUrl}
          alt={pet.name}
        />
      ) : null}
      <p className="safe-pet-support">
        Please read the personality notes before approaching, then contact my
        owner.
      </p>
      <PetInfoPanel pet={pet} />
      <div className="safe-pet-actions">
        <button type="button" onClick={() => void onFound()} disabled={foundConfirm}>
          {foundConfirm ? "Owner will be notified" : "I found this pet"}
        </button>
      </div>
      <p>
        <Link to="/">About I&rsquo;m a safe pet</Link>
      </p>
    </main>
  )
}
```

- [x] **Step 3: Wire route in `App.tsx`**

Add:

```tsx
<Route path="/pet/:publicId" element={<PublicPetPage />} />
```

Update `PAGE_TITLES` pattern (same as CoE `PageTitleUpdater`) so `/pet/...` titles use the product name.

- [x] **Step 4: Manual smoke**

```bash
npm run dev -w @tma/app-i-am-a-safe-pet
```

Open `/pet/demo-mochi` and `/pet/unknown`. Confirm fields render; unknown shows not-found. (Images may 404 until Task 5 copies assets — acceptable; seed always sets `photoUrl` to `/images/scottie.png`.)

- [x] **Step 5: Commit**

```bash
git add apps/i_am_a_safe_pet/src
git commit -m "$(cat <<'EOF'
Add public pet finder page with scan and found events.

EOF
)"
```

---

### Task 5: Home (example brand scene), privacy, allpages, owner dashboard, assets + styles

**Files:**
- Create: `apps/i_am_a_safe_pet/src/components/HomeBrandScene.tsx`
- Create: `apps/i_am_a_safe_pet/src/pages/HomePage.tsx`
- Create: `apps/i_am_a_safe_pet/src/pages/PrivacyPolicyPage.tsx`
- Create: `apps/i_am_a_safe_pet/src/pages/OwnerDashboardPage.tsx`
- Create: `apps/i_am_a_safe_pet/src/components/OwnerEventList.tsx`
- Create: `apps/i_am_a_safe_pet/public/images/*` (copied from example)
- Modify: `apps/i_am_a_safe_pet/src/App.tsx`
- Modify: `apps/i_am_a_safe_pet/src/styles/app.css`

**Interfaces:**
- Consumes: repository, `DEMO_OWNER_ACCOUNT_ID`, `VITE_OWNER_DEMO_PASSWORD`, example assets
- Produces: complete route table from the spec
- Session key: `tma-safe-pet-owner-auth` = `"1"` when authorized

- [x] **Step 1: Copy example assets**

Run the asset copy commands from the File structure section. Confirm the three files exist under `apps/i_am_a_safe_pet/public/images/`.

- [x] **Step 2: `HomeBrandScene` + `HomePage`**

`HomeBrandScene` ports the example’s storytelling (not its A4 absolute layout):

- Title is **outside** or above the scene as the page `h1` lockup: `I'm a safe pet` (class `safe-pet-display`, strongest text on the page).
- Dog left / cat right (stack on narrow viewports).
- Bubbles with exact example copy:
  - Dog: `I'm a safe pet, are you?`
  - Cat: `I most certainly am.`
- Centered NFC pictogram (`/images/nfc_tap_pictogram.svg`) + one short line: `Tap or scan the tag on a collar.`
- Use CSS (flex/grid + `rem`/`clamp`) — **do not** use print `cm` absolute positioning as the primary layout system.
- Add 2–3 subtle entrance motions (e.g. animals fade/rise, bubbles appear, NFC soft scale-in). Prefer CSS `@keyframes` / `animation`.

`HomePage` composition order:

1. Brand `h1`
2. `HomeBrandScene`
3. One short supporting sentence (product promise for finders/owners)
4. CTA group: Link/button to `/pet/demo-mochi` (“View demo pet”) and `/owner` (“Owner dashboard”)
5. Quiet privacy link

No card grid, stats, or promo chips.

- [x] **Step 3: Privacy page**

State clearly that finder-facing contact details are shown by design for lost-pet recovery.

- [x] **Step 4: Owner dashboard**

```tsx
const OWNER_AUTH_KEY = "tma-safe-pet-owner-auth"

function expectedPassword(): string {
  return import.meta.env.VITE_OWNER_DEMO_PASSWORD?.trim() || "safe-pet-demo"
}
```

Flow:

1. If `sessionStorage.getItem(OWNER_AUTH_KEY) !== "1"` → password form.
2. On success → set auth key; load `listPetsForOwner(DEMO_OWNER_ACCOUNT_ID)` + `listEventsForOwner(...)`.
3. Show each pet with last scan / last found derived from events, plus `<OwnerEventList />`.
4. Empty events copy: `No scans yet — events appear when someone opens your pet’s page.`
5. Sign out removes auth key.

`OwnerEventList` shows newest-first rows: relative or locale datetime, type (`Scanned` / `Found`), source.

Style with the same tokens; functional list — no speech bubbles.

- [x] **Step 5: Wire all routes in `App.tsx`**

| Path | Component |
|------|-----------|
| `/` | `HomePage` |
| `/pet/:publicId` | `PublicPetPage` |
| `/owner` | `OwnerDashboardPage` |
| `/privacy-policy` | `PrivacyPolicyPage` |
| `/allpages` | Dev links list |
| `*` | `NotFoundPage` |

- [x] **Step 6: Style `app.css`**

Expand tokens and layouts:

- Atmosphere background from example gray (may use a soft radial/gradient — not flat-only if it helps depth).
- Paper/content surfaces for public + owner reading.
- Personality block visually dominant (gold/navy accent border or background — keep readable).
- Bubble styles adapted from example (white fill, `#222` border, tail) but responsive.
- CTA buttons using navy / bright-blue; gold as accent only.
- Mobile-friendly spacing; Home first viewport still brand-first.

- [x] **Step 7: Manual smoke**

1. Home shows brand lockup, both animals, bubbles, NFC, CTAs (desktop + narrow width).
2. Open `/pet/demo-mochi` in one profile/session; photo loads from `/images/scottie.png`.
3. Open `/owner`, login with `safe-pet-demo`, see a `scan` event.
4. Click “I found this pet”, refresh owner dashboard, see `found`.

- [x] **Step 8: Commit**

```bash
git add apps/i_am_a_safe_pet
git commit -m "$(cat <<'EOF'
Add home brand scene, privacy, and owner dashboard for safe-pet.

EOF
)"
```

---

### Task 6: Monorepo wiring + docs

**Files:**
- Modify: root `package.json` (scripts `dev:i-am-a-safe-pet`, `build:i-am-a-safe-pet`, aggregate `build`)
- Modify: root `README.md` (layout + Netlify table + commands)
- Create: `apps/i_am_a_safe_pet/README.md`

**Interfaces:**
- Produces: discoverable via `npm run dev` picker (automatic); documented Netlify row

- [x] **Step 1: Update root `package.json` scripts**

Add:

```json
"build:i-am-a-safe-pet": "npm run build -w @tma/app-i-am-a-safe-pet",
"dev:i-am-a-safe-pet": "npm run dev -w @tma/app-i-am-a-safe-pet"
```

Append `&& npm run build -w @tma/app-i-am-a-safe-pet` to the aggregate `build` script.

- [x] **Step 2: README updates**

Root README layout bullet:

```
i_am_a_safe_pet/   → safe-pet.takemearound.gallery (lost-pet public pages + owner dashboard)
```

Netlify table row:

| I Am A Safe Pet | *(empty)* + Package directory `apps/i_am_a_safe_pet` | `apps/i_am_a_safe_pet/dist` |

App README: purpose, routes, demo ids/password, localStorage note, Backend deferred, note that Home visuals are adapted from the `safe_pet_page` example (animals + NFC pictogram).

- [x] **Step 3: Verify**

```bash
npm run test -w @tma/app-i-am-a-safe-pet
npm run build -w @tma/app-i-am-a-safe-pet
npm run build
```

Expected: tests pass; app build passes; aggregate build passes (may be slow).

- [x] **Step 4: Commit**

```bash
git add package.json README.md apps/i_am_a_safe_pet/README.md
git commit -m "$(cat <<'EOF'
Wire i_am_a_safe_pet into monorepo scripts and docs.

EOF
)"
```

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Home brand scene from `safe_pet_page` (animals, bubbles, NFC, palette) | Task 5 |
| Public pet fields (name, owner, contact, personality, allergies, vet) | Task 4 |
| Home page product intro + CTAs | Task 5 |
| Owner dashboard scan/found UX | Task 5 |
| PetProfile + PetEvent model | Task 2–3 |
| QR/NFC → `/pet/:publicId` + scan on view | Task 4 |
| Found CTA | Task 4 |
| Roles finder vs owner | Tasks 4–5 |
| Repository seam / no Backend | Task 3 |
| Monorepo app wiring | Tasks 1, 6 |
| No Arkin analytics / SiteId in v1 | Global constraints |
| No example print toolbar / A4 shell / A4 print route | Global constraints |
| Demo pet Mochi + Scottie `photoUrl` (placeholder art) | Task 2 + Task 5 assets |
| Georgia display font (v1) | Task 1 tokens + `index.html` |
| Privacy note | Task 5 |
| Verification build + tests + smoke | Tasks 1–6 |

## Self-review notes

- No TBD/placeholder steps remain for v1 product scope.
- Open questions 1–3 locked: Scottie art for Mochi demo photo; Georgia display; print tooling out of v1.
- Types and method names are consistent across tasks (`createLocalSafePetRepository`, `getSafePetRepository`, `recordEvent`, `DEMO_PET_PUBLIC_ID`).
- Personality prominence called out in Task 4 CSS class + Task 5 styles.
- Example assets and HomeBrandScene are explicit; product routes beyond the example remain from the prior plan.
- Arkin dashboard intentionally omitted to match spec.
- Critical mismatch resolved in docs: example is marketing/print-only → Home visual reference; public pet + owner dashboard stay TMA product requirements.
