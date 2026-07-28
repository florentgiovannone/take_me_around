# Church of England App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `apps/church_of_england` as a lean museum-style NFC site with one Westminster Abbey demo stop and full dashboard site-scope analytics.

**Architecture:** Scaffold a Vite/React app from the museum shell (no museum artworks, no Arkin Rodin/maintenance). Extend `@tma/config` with `church_of_england`, add `@tma/analytics-church-of-england` by adapting museum analytics for host `church.takemearound.gallery` and stop `/westminster-abbey`, then wire `@tma/dashboard-scope` and the dashboard app.

**Tech Stack:** npm workspaces, Vite 8, React 19, React Router 7, TypeScript, Sass/CSS (museum styles), Netlify redirects plugin pattern.

**Spec:** `docs/superpowers/specs/2026-07-28-church-of-england-app-design.md`

## Global Constraints

- App folder: `apps/church_of_england`; package name: `@tma/app-church-of-england`
- Site id string: `church_of_england` (underscore) everywhere in TypeScript; dashboard URL path: `/dashboard/church-of-england` (hyphens)
- Provisional host: `church.takemearound.gallery`
- Demo stop path: `/westminster-abbey`; title: `Westminster Abbey`
- English-only placeholders; no locale matrix; no ElevenLabs/translate scripts in v1
- Do not copy museum artwork pages/assets or Arkin Rodin content
- Verification is TypeScript/Vite build + manual smoke (no new automated test suite required by spec)
- Commit after each task with a concise message

## File structure (locked)

| Path | Responsibility |
|------|----------------|
| `packages/config/src/index.ts` | `SiteId`, `SITE_META`, pickable lists |
| `packages/analytics-church-of-england/` | CoE log filtering + dashboard analytics helpers |
| `packages/dashboard-scope/src/index.ts` | Scope branching for CoE |
| `packages/dashboard-scope/src/visitorNumbers.ts` | SAR/visitor helpers for CoE |
| `packages/dashboard-scope/package.json` | Depend on new analytics package |
| `apps/dashboard/src/App.tsx` | Fixed-scope route |
| `apps/dashboard/src/config/operators.ts` | Operator sites + `getStoredScope` parse |
| `apps/church_of_england/` | Public NFC site |
| Root `package.json`, `README.md` | Scripts + Netlify table |

---

### Task 1: Add `church_of_england` to `@tma/config`

**Files:**
- Modify: `packages/config/src/index.ts`
- Test: Typecheck consumers later; smoke by reading exports

**Interfaces:**
- Produces: `SiteId` includes `"church_of_england"`; `SITE_META.church_of_england`; id present in `ALL_SITE_IDS` and `PICKABLE_SITE_IDS`

- [ ] **Step 1: Update config types and metadata**

Replace the site definitions in `packages/config/src/index.ts` so they match:

```ts
export type SiteId = "gallery" | "museum" | "arkin" | "church_of_england"

export type SiteScope = SiteId | "combined"

export const ALL_SITE_IDS: SiteId[] = ["gallery", "museum", "arkin", "church_of_england"]

export const PICKABLE_SITE_IDS: SiteId[] = ["gallery", "museum", "church_of_england"]

export const SITE_META: Record<
  SiteId,
  { label: string; domainLabel: string; host: string }
> = {
  gallery: {
    label: "Gallery",
    domainLabel: ".gallery",
    host: "takemearound.gallery",
  },
  museum: {
    label: "Museum",
    domainLabel: ".museum",
    host: "takemearound.museum",
  },
  arkin: {
    label: "Arkin Gallery",
    domainLabel: "Arkin Gallery",
    host: "arkin.takemearound.gallery",
  },
  church_of_england: {
    label: "Church of England",
    domainLabel: "Church of England",
    host: "church.takemearound.gallery",
  },
}
```

Leave existing `scopeLabel` / `scopeSubtitle` / `scopeDomainHint` / `scopeBadgeLabel` / `scopeOptionLabel` helpers unchanged — they already key off `SITE_META` / `PICKABLE_SITE_IDS`. Only add an explicit subtitle branch if needed for parity with arkin (optional; default `Live Church of England activity` via `SITE_META[scope].domainLabel` is fine).

- [ ] **Step 2: Commit**

```bash
git add packages/config/src/index.ts
git commit -m "$(cat <<'EOF'
Add church_of_england site id to shared config.

EOF
)"
```

---

### Task 2: Create `@tma/analytics-church-of-england`

**Files:**
- Create: `packages/analytics-church-of-england/package.json`
- Create: `packages/analytics-church-of-england/src/index.ts` (adapted from museum)
- Modify: root `package-lock.json` via `npm install` at repo root

**Interfaces:**
- Consumes: museum analytics as the copy source
- Produces (names used by Task 3):
  - `TRACKED_CHURCH_OF_ENGLAND_ARTWORKS`
  - `getChurchOfEnglandLogs(logs)`
  - `buildChurchOfEnglandActivityEntries(logs)`
  - `buildTrackedArtworkScanGroups(logs)`
  - `buildOverviewAnalytics(logs)`
  - `buildAudienceAnalytics(logs)`
  - `buildWeeklySeries(logs, weekOffset)`
  - `buildMonthlyCalendarGrid(logs, monthOffset)`
  - `listDistinctChurchOfEnglandSars(logs)`
  - `buildSarChurchOfEnglandTimelineEvents(logs, sarQuery)`
  - `buildSarTimelinePlot(logs)` / related SAR plot helpers used for museum
  - `buildActivityVisitDetails(log)`
  - `getSarFromLog(log)`
  - `ChurchOfEnglandActivityEntry` (same shape as museum activity entry)

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@tma/analytics-church-of-england",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  }
}
```

- [ ] **Step 2: Copy museum analytics and apply renames**

```bash
mkdir -p packages/analytics-church-of-england/src
cp packages/analytics-museum/src/index.ts packages/analytics-church-of-england/src/index.ts
```

Then apply these exact textual transforms (order matters; use a small node script or careful `perl -pi`):

1. Host / domain:
   - `takemearound.museum` → `church.takemearound.gallery`
   - Reject logic must still reject `takemearound.gallery` (bare gallery), `takemearound.museum`, and arkin host strings that would collide — keep museum’s “reject other hosts” pattern but treat `church.takemearound.gallery` as the allowed host.
2. Tracked artworks constant — replace the whole `TRACKED_MUSEUM_ARTWORKS` array with:

```ts
export const TRACKED_CHURCH_OF_ENGLAND_ARTWORKS = [
  { title: "Westminster Abbey", path: "/westminster-abbey" },
]
```

3. Symbol renames (global in the file):

| From | To |
|------|-----|
| `TRACKED_MUSEUM_ARTWORKS` | `TRACKED_CHURCH_OF_ENGLAND_ARTWORKS` |
| `TRACKED_MUSEUM_PATHS` | `TRACKED_CHURCH_OF_ENGLAND_PATHS` |
| `TRACKED_MUSEUM_PATHS_BY_LENGTH` | `TRACKED_CHURCH_OF_ENGLAND_PATHS_BY_LENGTH` |
| `TRACKED_MUSEUM_TITLES` | `TRACKED_CHURCH_OF_ENGLAND_TITLES` |
| `TRACKED_MUSEUM_PATH_ALIASES` | `TRACKED_CHURCH_OF_ENGLAND_PATH_ALIASES` |
| `isMuseumDomainMessage` | `isChurchOfEnglandDomainMessage` |
| `isMuseumLog` | `isChurchOfEnglandLog` |
| `getMuseumLogLink` | `getChurchOfEnglandLogLink` |
| `getMuseumLogs` | `getChurchOfEnglandLogs` |
| `MuseumActivityEntry` | `ChurchOfEnglandActivityEntry` |
| `buildMuseumActivityEntries` | `buildChurchOfEnglandActivityEntries` |
| `museumSeenEntries` | `churchOfEnglandSeenEntries` |
| `listDistinctMuseumSars` | `listDistinctChurchOfEnglandSars` |
| `buildSarMuseumTimelineEvents` | `buildSarChurchOfEnglandTimelineEvents` |

4. Clear path aliases to `[]` (no hoa alias needed).
5. Grep the new file for leftover `museum` / `Museum` / `MUSEUM` / `takemearound.museum` and fix any remaining identifiers that are CoE-specific. Shared words like “message” are fine.

- [ ] **Step 3: Install workspace package**

```bash
npm install
```

Expected: lockfile lists `packages/analytics-church-of-england`.

- [ ] **Step 4: Sanity-check exports**

```bash
rg "export (const|function|type) " packages/analytics-church-of-england/src/index.ts | head -80
rg "takemearound\.museum|TRACKED_MUSEUM|getMuseumLogs" packages/analytics-church-of-england/src/index.ts
```

Expected: second command returns no matches.

- [ ] **Step 5: Commit**

```bash
git add packages/analytics-church-of-england package-lock.json
git commit -m "$(cat <<'EOF'
Add church of england analytics package.

EOF
)"
```

---

### Task 3: Wire CoE into `@tma/dashboard-scope`

**Files:**
- Modify: `packages/dashboard-scope/package.json`
- Modify: `packages/dashboard-scope/src/index.ts`
- Modify: `packages/dashboard-scope/src/visitorNumbers.ts`

**Interfaces:**
- Consumes: Task 2 exports listed above; `SiteId` / `SiteScope` from Task 1
- Produces: all existing `dashboard-scope` functions accept `scope === "church_of_england"` and include CoE in combined when enabled

- [ ] **Step 1: Add dependency**

In `packages/dashboard-scope/package.json` dependencies, add:

```json
"@tma/analytics-church-of-england": "*"
```

- [ ] **Step 2: Import CoE analytics in `index.ts` and `visitorNumbers.ts`**

```ts
import * as churchOfEngland from "@tma/analytics-church-of-england"
```

- [ ] **Step 3: Extend every scope branch**

In `packages/dashboard-scope/src/index.ts`, for each gallery/museum/arkin branch, add `church_of_england` using the museum pattern as the template. Required touch points:

1. `getCombinedScopedLogs` — also push `churchOfEngland.getChurchOfEnglandLogs(logs)` when `isActiveCombinedSite("church_of_england")`
2. `combinedSitesLabel` — map `church_of_england` → `SITE_META` domain label or `"Church of England"`
3. `buildActivityVisitDetails` — combined detection + `scope === "church_of_england"` branch calling `churchOfEngland.buildActivityVisitDetails`
4. `getScopedLogs` (or equivalent) — `churchOfEngland.getChurchOfEnglandLogs`
5. Tracked artwork counts — `TRACKED_CHURCH_OF_ENGLAND_ARTWORKS.length`
6. Copy helpers (scan labels, empty states, host hints) — CoE wording: `"tracked Church of England scans"`, host `church.takemearound.gallery`, empty `"No tracked Church of England activity found."`
7. `buildActivityEntries` / scan groups / overview / audience / weekly / monthly / SAR list / SAR timeline / SAR plot — each needs a CoE branch and combined aggregation when site enabled

In `visitorNumbers.ts`:

```ts
function getSarForLog(log: PoiseLog, scope: SiteScope): string | null {
  if (scope === "arkin") return arkin.getSarFromLog(log)
  if (scope === "museum") return museum.getSarFromLog(log)
  if (scope === "church_of_england") return churchOfEngland.getSarFromLog(log)
  if (scope === "gallery") return gallery.getSarFromLog(log)
  return (
    gallery.getSarFromLog(log) ??
    museum.getSarFromLog(log) ??
    arkin.getSarFromLog(log) ??
    churchOfEngland.getSarFromLog(log)
  )
}

function getScopedLogs(logs: PoiseLog[], scope: SiteScope): PoiseLog[] {
  if (scope === "gallery") return gallery.getGalleryLogs(logs)
  if (scope === "arkin") return arkin.getArkinLogs(logs)
  if (scope === "museum") return museum.getMuseumLogs(logs)
  if (scope === "church_of_england") return churchOfEngland.getChurchOfEnglandLogs(logs)
  // combined: loop getActiveCombinedSiteIds() and include churchOfEngland branch
  ...
}
```

- [ ] **Step 4: Typecheck dashboard-scope consumers**

```bash
npm run build -w @tma/app-dashboard
```

Expected: compile succeeds (route not added yet is fine; scope type must compile). If `getStoredScope` still narrows old unions, fix in Task 4.

- [ ] **Step 5: Commit**

```bash
git add packages/dashboard-scope
git commit -m "$(cat <<'EOF'
Wire church of england scope into dashboard analytics.

EOF
)"
```

---

### Task 4: Dashboard route + operator scope parsing

**Files:**
- Modify: `apps/dashboard/src/App.tsx`
- Modify: `apps/dashboard/src/config/operators.ts`
- Modify: `apps/dashboard/tsconfig*.json` only if path mapping for the new analytics package is required (usually not — dashboard imports via dashboard-scope)

**Interfaces:**
- Produces: `/dashboard/church-of-england` locks `fixedScope="church_of_england"`; session scope can restore `church_of_england`; default operator may include CoE

- [ ] **Step 1: Add fixed-scope route**

In `apps/dashboard/src/App.tsx`:

```tsx
<Route
  path="/dashboard/church-of-england"
  element={<Dashboard fixedScope="church_of_england" />}
/>
```

Keep existing gallery/museum routes.

- [ ] **Step 2: Update `getStoredScope` parsing**

In `apps/dashboard/src/config/operators.ts`, allow restoring the new scope:

```ts
export function getStoredScope(): SiteScope | null {
  const raw = sessionStorage.getItem(SCOPE_SESSION_KEY)
  if (
    raw === "gallery" ||
    raw === "museum" ||
    raw === "arkin" ||
    raw === "church_of_england" ||
    raw === "combined"
  ) {
    return raw
  }
  return null
}
```

- [ ] **Step 3: Include CoE on default operator (settings-visible)**

Update the default operator sites so CoE can be enabled without a new operator profile:

```ts
{
  id: "default",
  name: "Main Dashboard",
  sites: ["gallery", "museum", "church_of_england"],
},
```

Optionally add a dedicated operator:

```ts
{
  id: "church-of-england-only",
  name: "Church of England team",
  sites: ["church_of_england"],
},
```

- [ ] **Step 4: Build dashboard**

```bash
npm run build -w @tma/app-dashboard
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/dashboard
git commit -m "$(cat <<'EOF'
Add church of england dashboard route and operator scope.

EOF
)"
```

---

### Task 5: Scaffold `apps/church_of_england` shell

**Files:**
- Create app by copying museum toolchain files, then stripping artworks
- Create/modify listed below

**Copy these museum files as starting points** (then edit):

- `package.json` → rename to `@tma/app-church-of-england`; keep only `dev`, `test:host`, `build`, `preview`, `preview:test:host` scripts (drop translate/audio scripts)
- `index.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`, `netlify.toml`
- `public/favicon.png`
- `src/main.tsx`, `src/vite-env.d.ts`, `src/apiBaseUrl.ts`, `src/parseApiJson.ts` (if present and used)
- `src/styles/style.css`
- `src/components/AudioPlayer.tsx`, `Footer.tsx`, `ExternalDashboardRedirect.tsx` (+ any `audio/` helper dirs those import)
- `src/pages/ContactPage.tsx`, `PrivacyPolicyPage.tsx`, `UnderlyingTechnologyPage.tsx`, `NotFoundPage.tsx`

**Do not copy:** museum artwork pages, `src/data/*` artwork locales, `src/assets/museum` artwork trees, `scripts/*` translate/audio generators.

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@tma/app-church-of-england",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --open",
    "test:host": "vite --host 0.0.0.0 --port 4173 --mode test",
    "build": "node scripts/write-netlify-redirects.mjs && tsc --noEmit -p tsconfig.app.json && vite build",
    "preview": "vite preview",
    "preview:test:host": "vite preview --host 0.0.0.0 --port 4173"
  },
  "dependencies": {
    "@tma/dashboard-scope": "*",
    "@tma/dashboard-ui": "*",
    "react": "^19.2.5",
    "react-dom": "^19.2.5",
    "react-router-dom": "^7.14.2"
  },
  "devDependencies": {
    "@types/node": "^25.9.3",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "sass": "^1.99.0",
    "typescript": "^5.9.3",
    "vite": "^8.0.10"
  },
  "optionalDependencies": {
    "@rolldown/binding-linux-x64-gnu": "^1.0.0-rc.17",
    "lightningcss-linux-x64-gnu": "^1.32.0"
  }
}
```

If museum’s `build` uses `scripts/write-netlify-redirects.mjs`, copy that script and any `apiProxyRedirectsPolicy.mjs` it imports; otherwise simplify `build` to `tsc --noEmit -p tsconfig.app.json && vite build` like gallery if redirects are only emitted by the Vite plugin.

- [ ] **Step 2: Adapt `vite.config.ts` dashboard redirects**

Change redirect targets from `/dashboard/museum` to `/dashboard/church-of-england`:

```ts
lines.push(`/dashboard      ${arkinDashboard}/dashboard/church-of-england     301!`)
lines.push(`/dashboard/*    ${arkinDashboard}/dashboard/church-of-england/:splat  301!`)
```

- [ ] **Step 3: Adapt `netlify.toml`**

```toml
[build]
  command = "cd ../.. && npm ci && npm run build -w @tma/app-church-of-england"
  publish = "dist"
  ignore = "git diff --quiet $CACHED_COMMIT_REF $COMMIT_REF -- apps/church_of_england packages"
```

- [ ] **Step 4: Write lean `App.tsx`**

```tsx
import { Link, Route, Routes, useLocation } from "react-router-dom"
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage"
import UnderlyingTechnologyPage from "./pages/UnderlyingTechnologyPage"
import ContactPage from "./pages/ContactPage"
import ExternalDashboardRedirect from "./components/ExternalDashboardRedirect"
import NotFoundPage from "./pages/NotFoundPage"
import WestminsterAbbeyPage from "./pages/WestminsterAbbeyPage"
import "./styles/style.css"
import { useEffect } from "react"

const PAGE_TITLES: Record<string, string> = {
  "/": "Take Me Around",
  "/allpages": "All Pages",
  "/westminster-abbey": "Westminster Abbey",
  "/underlying-technology": "Underlying Technology",
  "/contact": "Contact",
  "/privacy-policy": "Privacy Policy",
  "/dashboard": "Dashboard",
}

function PageTitleUpdater() {
  const location = useLocation()
  useEffect(() => {
    const pageTitle = PAGE_TITLES[location.pathname]
    document.title = pageTitle
      ? `${pageTitle} | Take Me Around`
      : `Page not found | Take Me Around`
  }, [location.pathname])
  return null
}

function AllPage() {
  return (
    <main style={{ margin: "0 auto", maxWidth: 900, padding: "2rem 1rem" }}>
      <h1>Take Me Around</h1>
      <p>Church of England demo pages.</p>
      <p>
        <Link to="/westminster-abbey">Go to Westminster Abbey page</Link>
      </p>
      <p>
        <Link to="/privacy-policy">Go to Privacy Policy page</Link>
      </p>
      <p>
        <Link to="/underlying-technology">Go to Underlying Technology page</Link>
      </p>
      <p>
        <Link to="/contact">Go to Contact page</Link>
      </p>
    </main>
  )
}

function HomePage() {
  return (
    <div className="tma-home-shell">
      <main className="tma-home-main">
        <div className="tma-home-intro">The Home Of</div>
        <h1 className="tma-home-title">Take Me Around</h1>
        <div className="tma-home-divider" />
      </main>
      <footer className="tma-home-footer">
        <div>© 2026 Take Me Around</div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <>
      <PageTitleUpdater />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/allpages" element={<AllPage />} />
        <Route path="/westminster-abbey" element={<WestminsterAbbeyPage />} />
        <Route path="/underlying-technology" element={<UnderlyingTechnologyPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/dashboard"
          element={<ExternalDashboardRedirect path="/dashboard/church-of-england" />}
        />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
```

- [ ] **Step 5: Add `.env.example`**

```bash
VITE_API_PROXY_TARGET=
VITE_ARKIN_DASHBOARD_URL=https://arkin.takemearound.gallery
```

- [ ] **Step 6: Root scripts**

In root `package.json`, add:

```json
"build:church-of-england": "npm run build -w @tma/app-church-of-england",
"dev:church-of-england": "npm run dev -w @tma/app-church-of-england"
```

And append `&& npm run build -w @tma/app-church-of-england` to the aggregate `build` script.

- [ ] **Step 7: `npm install` and commit shell (page can be stub)**

If `WestminsterAbbeyPage` is not ready, add a temporary stub page that returns `<main><h1>Westminster Abbey</h1></main>` so the app typechecks; replace in Task 6.

```bash
npm install
git add apps/church_of_england package.json package-lock.json
git commit -m "$(cat <<'EOF'
Scaffold church of england public app shell.

EOF
)"
```

---

### Task 6: Westminster Abbey demo stop + assets

**Files:**
- Create: `apps/church_of_england/src/pages/WestminsterAbbeyPage.tsx`
- Create: `apps/church_of_england/src/assets/church-of-england/images/westminster-abbey-placeholder.svg` (or `.png`)
- Create: `apps/church_of_england/src/assets/church-of-england/index.ts`
- Create: `apps/church_of_england/src/data/westminsterAbbey.ts` (English placeholder copy)
- Optional: `apps/church_of_england/src/assets/church-of-england/audio/` empty or omitted

**Interfaces:**
- Consumes: `AudioPlayer`, `Footer`, museum CSS classes
- Produces: working `/westminster-abbey` route

- [ ] **Step 1: Placeholder copy**

```ts
// apps/church_of_england/src/data/westminsterAbbey.ts
export const westminsterAbbeyCopy = {
  title: "Westminster Abbey",
  subtitle: "A Take Me Around demo stop",
  bannerTop: "Learn how this experience works",
  bannerBottom: "Learn how this experience works",
  imageAlt: "Placeholder image for Westminster Abbey",
  aboutHeading: "About this stop",
  aboutParagraphs: [
    "This is placeholder copy for the Church of England Take Me Around experience.",
    "Replace this text, image, and optional audio with the final Westminster Abbey content.",
  ],
  historyHeading: "History",
  historyParagraphs: [
    "Westminster Abbey has been a site of coronation, worship, and national ceremony for centuries.",
    "More historical detail will be added here.",
  ],
}
```

- [ ] **Step 2: Asset barrel**

Create a simple SVG placeholder (grey rectangle with “Westminster Abbey” text) and:

```ts
// apps/church_of_england/src/assets/church-of-england/index.ts
import westminsterAbbeyImage from "./images/westminster-abbey-placeholder.svg"

export const STOP_IMAGES: Record<string, string> = {
  "westminster-abbey": westminsterAbbeyImage,
}

/** Returns audio URL when an asset exists; null omits the player. */
export function getStopAudio(_slug: string): string | null {
  return null
}
```

- [ ] **Step 3: Page component**

Model on museum `SuttonHooHelmetPage`, without locale logic:

```tsx
import Footer from "../components/Footer"
import "../styles/style.css"
import AudioPlayer from "../components/AudioPlayer"
import { STOP_IMAGES, getStopAudio } from "../assets/church-of-england"
import { westminsterAbbeyCopy as copy } from "../data/westminsterAbbey"

const STOP_SLUG = "westminster-abbey"

export default function WestminsterAbbeyPage() {
  const audioSrc = getStopAudio(STOP_SLUG)
  return (
    <>
      <main className="tma-gallery-page">
        <header className="tma-header">
          <div className="tma-header-inner">
            <h1 className="tma-page-title">{copy.title}</h1>
            <p className="tma-page-subtitle">{copy.subtitle}</p>
          </div>
        </header>
        <a href="/underlying-technology" className="tma-banner-link">
          <p className="tma-banner-text">
            <strong>{copy.bannerTop}</strong>
          </p>
        </a>
        <div className="tma-content">
          {audioSrc ? <AudioPlayer src={audioSrc} /> : null}
          <img
            src={STOP_IMAGES[STOP_SLUG]!}
            alt={copy.imageAlt}
            className="tma-painting-image"
          />
          <h2>{copy.aboutHeading}</h2>
          {copy.aboutParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
          <h2>{copy.historyHeading}</h2>
          {copy.historyParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>
        <a href="/underlying-technology" className="tma-banner-link">
          <p className="tma-banner-text">
            <strong>{copy.bannerBottom}</strong>
          </p>
        </a>
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 4: Build the app**

```bash
npm run build -w @tma/app-church-of-england
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/church_of_england
git commit -m "$(cat <<'EOF'
Add Westminster Abbey demo stop for church of england app.

EOF
)"
```

---

### Task 7: Docs + final verification

**Files:**
- Create: `apps/church_of_england/README.md`
- Modify: `README.md` (root)

- [ ] **Step 1: App README**

```md
# Church of England (`church_of_england`)

Museum-style public NFC site with a Westminster Abbey demo stop and dashboard scope `church_of_england`.

## Local dev

From monorepo root:

```bash
npm install
npm run dev:church-of-england
```

Copy `.env.example` to `.env` and set `VITE_API_PROXY_TARGET`, `VITE_ARKIN_DASHBOARD_URL` if needed.

## Netlify

| Setting | Value |
|---------|--------|
| Base directory | `apps/church_of_england` |
| Publish directory | `dist` |

Provisional public host in config: `church.takemearound.gallery`.
```

- [ ] **Step 2: Root README**

Update layout tree and Netlify table to include Church of England / `apps/church_of_england`. Add `dev:church-of-england` to the commands list.

- [ ] **Step 3: Final builds**

```bash
npm run build -w @tma/app-church-of-england
npm run build -w @tma/app-dashboard
```

Expected: both PASS.

- [ ] **Step 4: Manual smoke checklist**

With `npm run dev:church-of-england`:

- `/` home renders
- `/westminster-abbey` shows title, placeholder image, sections, no audio player
- `/allpages` links work
- `/dashboard` begins redirect toward `/dashboard/church-of-england`
- unknown path shows Not Found

- [ ] **Step 5: Commit**

```bash
git add README.md apps/church_of_england/README.md
git commit -m "$(cat <<'EOF'
Document church of england app in READMEs.

EOF
)"
```

---

## Plan self-review

1. **Spec coverage:** Architecture, pages, analytics/config/dashboard, errors, verification, docs — all mapped to Tasks 1–7. Out-of-scope items (locales, ElevenLabs, backend, analytics generalization) intentionally omitted.
2. **Placeholders:** No TBD steps; analytics uses explicit rename table; provisional host is concrete.
3. **Type consistency:** `church_of_england` site id vs `/dashboard/church-of-england` path hyphenation documented; analytics export names match Task 3 consumers.
