# Church In-App Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Host a password-protected analytics dashboard at `takemearound.church/dashboard` (Arkin pattern), locked to `.church` tags, while church stays in the main dashboard switcher.

**Architecture:** Port Arkin’s in-app dashboard into `apps/church_of_england`: same-origin `/api/secure/items`, church header/footer, `SiteScopeProvider` with `church_of_england`. Remove the React + Netlify redirects to `arkin.takemearound.gallery`. Do not change `apps/dashboard`.

**Tech Stack:** Vite 8, React 19, React Router 7, TypeScript, `@tma/dashboard-ui`, `@tma/dashboard-scope`, `@tma/analytics-church-of-england`

**Spec:** `docs/superpowers/specs/2026-08-25-church-in-app-dashboard-design.md`

## Global Constraints

- Pattern: Arkin in-app dashboard (not gallery/museum off-site redirect)
- Subtitle exact: `Live .church activity`
- Session key: `tma-dashboard-password-church`
- `VITE_DASHBOARD_PASSWORD` wins over session in local dev
- API header: `X-Dashboard-Password` only (do not send `X-Dashboard-App`)
- Scope lock: `SiteScopeProvider scope="church_of_england"`
- Tracked tags: Westminster Abbey + Southwell Minster (existing analytics; do not edit that package)
- Main dashboard: no code changes
- No new automated test suite; verify with `npm run build -w @tma/app-church-of-england` + manual smoke
- Do not commit secrets (`.env.local`)

---

## File map

| Path | Role |
|------|------|
| `apps/church_of_england/src/apiBaseUrl.ts` | Same-origin `/api` vs direct base; church + Netlify hosts |
| `apps/church_of_england/src/parseApiJson.ts` | Reject SPA/ngrok HTML masquerading as JSON |
| `apps/church_of_england/src/pages/Dashboard.tsx` | Password gate, poll, five tabs |
| `apps/church_of_england/src/App.tsx` | `/dashboard` → Dashboard page |
| `apps/church_of_england/src/vite-env.d.ts` | `VITE_DASHBOARD_PASSWORD` |
| `apps/church_of_england/vite.config.ts` | Package aliases; drop `/dashboard` 301 |
| `apps/church_of_england/.env.example` | Document dashboard env; drop Arkin dashboard URL |
| `apps/church_of_england/netlify.toml` | Comment: `/dashboard` is in-app |
| `apps/church_of_england/README.md` | Local dashboard docs |
| `apps/church_of_england/src/components/ExternalDashboardRedirect.tsx` | Delete |

---

### Task 1: API helpers, env types, Vite aliases

**Files:**
- Create: `apps/church_of_england/src/apiBaseUrl.ts`
- Create: `apps/church_of_england/src/parseApiJson.ts`
- Modify: `apps/church_of_england/src/vite-env.d.ts`
- Modify: `apps/church_of_england/vite.config.ts`

**Interfaces:**
- Consumes: `import.meta.env.VITE_API_PROXY_TARGET`, `VITE_API_BASE_URL`
- Produces: `apiBaseUrl(): string`, `apiNeedsNgrokHeader(): boolean`, `parseApiJson<T>(response: Response): Promise<T>`

- [ ] **Step 1: Add `apiBaseUrl.ts`**

```ts
function isDeployedSite(hostname: string): boolean {
  return (
    hostname === "takemearound.church" ||
    hostname === "www.takemearound.church" ||
    hostname === "church.takemearound.gallery" ||
    hostname.endsWith(".netlify.app")
  )
}

/** API origin for fetch(). Empty = same host (/api/...), proxied by Vite (dev) or Netlify (production). */
export function apiBaseUrl(): string {
  const proxyTarget = (import.meta.env.VITE_API_PROXY_TARGET ?? "").trim()
  const apiBase = (import.meta.env.VITE_API_BASE_URL ?? "").trim().replace(/\/$/, "")
  const hasProxyConfig = Boolean(proxyTarget || apiBase)

  if (typeof window !== "undefined") {
    const host = window.location.hostname
    const isLocal =
      host === "localhost" || host === "127.0.0.1" || host === "[::1]"
    if (isDeployedSite(host)) {
      return ""
    }
    if (isLocal && hasProxyConfig) {
      return ""
    }
    if (window.location.protocol === "https:" && apiBase.startsWith("http://")) {
      return ""
    }
  }

  return apiBase
}

/** Send on /api proxy (Netlify/Vite) and direct ngrok URLs — skips ngrok's browser warning HTML. */
export function apiNeedsNgrokHeader(): boolean {
  const base = apiBaseUrl()
  return base === "" || base.includes("ngrok")
}
```

- [ ] **Step 2: Add `parseApiJson.ts`**

```ts
/** Parse JSON; throws if the host returned SPA HTML (e.g. Netlify without an API proxy). */
export async function parseApiJson<T>(response: Response): Promise<T> {
  const ct = response.headers.get("content-type") || ""
  if (ct.includes("application/json")) {
    return (await response.json()) as T
  }
  const text = await response.text()
  if (/<!doctype|<html/i.test(text)) {
    if (/ngrok|ERR_NGROK/i.test(text)) {
      throw new Error(
        "Ngrok returned its browser warning page instead of API data. Redeploy the latest frontend (it sends ngrok-skip-browser-warning), or open the ngrok URL once in a tab and click Continue."
      )
    }
    throw new Error(
      "Received the web app (HTML) instead of API data. Netlify is not proxying /api/* to your backend. Set VITE_API_PROXY_TARGET in Netlify env vars, then Deploy → Clear cache and deploy site. Check dist/_redirects contains a line starting with /api/*"
    )
  }
  throw new Error(`Expected JSON from the API, got: ${ct || "unknown"}`)
}
```

- [ ] **Step 3: Extend `vite-env.d.ts`**

Replace the file with:

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_API_PROXY_TARGET?: string
  readonly VITE_DASHBOARD_PASSWORD?: string
}
```

- [ ] **Step 4: Add Vite `resolve.alias` and drop `/dashboard` 301s**

In `apps/church_of_england/vite.config.ts`:

1. After `const apiTarget = ...`, delete the `arkinDashboard` constant.
2. After `return {`, add:

```ts
    resolve: {
      alias: {
        "@tma/config": path.join(packagesDir, "config/src/index.ts"),
        "@tma/analytics-gallery": path.join(packagesDir, "analytics-gallery/src/index.ts"),
        "@tma/analytics-arkin": path.join(packagesDir, "analytics-arkin/src/index.ts"),
        "@tma/analytics-museum": path.join(packagesDir, "analytics-museum/src/index.ts"),
        "@tma/analytics-church-of-england": path.join(
          packagesDir,
          "analytics-church-of-england/src/index.ts"
        ),
        "@tma/dashboard-scope": path.join(packagesDir, "dashboard-scope/src/index.ts"),
        "@tma/dashboard-ui": path.join(packagesDir, "dashboard-ui/src/index.ts"),
      },
    },
```

Define `const packagesDir = path.resolve(__dirname, "../../packages")` next to `apiTarget`.

3. In the `closeBundle` plugin, delete the two `lines.push` calls that 301 `/dashboard` and `/dashboard/*`. Keep `/api/*` and `/*    /index.html   200`.

- [ ] **Step 5: Typecheck helpers compile**

Run: `npx tsc --noEmit -p apps/church_of_england/tsconfig.app.json`

Expected: PASS (no errors). Dashboard page is not imported yet; aliases are unused until Task 2.

- [ ] **Step 6: Commit**

```bash
git add \
  apps/church_of_england/src/apiBaseUrl.ts \
  apps/church_of_england/src/parseApiJson.ts \
  apps/church_of_england/src/vite-env.d.ts \
  apps/church_of_england/vite.config.ts
git commit -m "Add church dashboard API helpers and stop /dashboard 301."
```

---

### Task 2: In-app Dashboard page and route

**Files:**
- Create: `apps/church_of_england/src/pages/Dashboard.tsx`
- Modify: `apps/church_of_england/src/App.tsx`
- Delete: `apps/church_of_england/src/components/ExternalDashboardRedirect.tsx`

**Interfaces:**
- Consumes: `apiBaseUrl()`, `apiNeedsNgrokHeader()`, `parseApiJson<PoiseLog[]>()`, `@tma/dashboard-ui` panels, `SiteScopeProvider`
- Produces: route `/dashboard` renders the in-app dashboard; no off-site redirect

- [ ] **Step 1: Create `Dashboard.tsx`**

Port gallery chrome + Arkin env-password behaviour. Full file:

```tsx
import { type FormEvent, useEffect, useRef, useState } from "react"
import Footer from "../components/Footer"
import {
  DashboardActivityPanel,
  DashboardAudiencePanel,
  DashboardCountsPanel,
  DashboardOverviewPanel,
  DashboardSarTimelinePanel,
  SiteScopeProvider,
} from "@tma/dashboard-ui"
import { apiBaseUrl, apiNeedsNgrokHeader } from "../apiBaseUrl"
import { parseApiJson } from "../parseApiJson"
import type { PoiseLog } from "@tma/dashboard-scope"
import "../styles/style.css"

const DASHBOARD_PASSWORD_KEY = "tma-dashboard-password-church"
const POLL_INTERVAL_MS = 5000
const envDashboardPassword = (import.meta.env.VITE_DASHBOARD_PASSWORD ?? "").trim()

/** Env wins in local dev so .env.local changes apply without clearing session manually. */
function resolveDashboardPassword(): string | null {
  if (envDashboardPassword) return envDashboardPassword
  return sessionStorage.getItem(DASHBOARD_PASSWORD_KEY)
}

type DashboardTab = "activity" | "counts" | "overview" | "audience" | "sar"

type FetchLogsResult =
  | { ok: true; data: PoiseLog[] }
  | { ok: false; unauthorized: boolean; message: string }

async function fetchDashboardLogs(password: string): Promise<FetchLogsResult> {
  const base = apiBaseUrl()
  const url = base ? `${base}/api/secure/items` : "/api/secure/items"
  const headers: Record<string, string> = {
    "X-Dashboard-Password": password,
  }
  if (apiNeedsNgrokHeader()) {
    headers["ngrok-skip-browser-warning"] = "true"
  }
  const response = await fetch(url, { headers })

  if (response.status === 401) {
    return { ok: false, unauthorized: true, message: "Incorrect password." }
  }
  if (response.status === 503) {
    return {
      ok: false,
      unauthorized: false,
      message: "Server is not configured for secure access.",
    }
  }
  if (response.status === 404) {
    return {
      ok: false,
      unauthorized: false,
      message:
        "API not reachable (404). Check Flask + ngrok are running and VITE_API_BASE_URL in .env matches your ngrok URL.",
    }
  }
  if (!response.ok) {
    return {
      ok: false,
      unauthorized: false,
      message: `Request failed with status ${response.status}`,
    }
  }

  const data = await parseApiJson<PoiseLog[]>(response)
  return { ok: true, data }
}

function Dashboard() {
  const passwordRef = useRef("")
  const [logs, setLogs] = useState<PoiseLog[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<DashboardTab>("activity")
  const [passwordInput, setPasswordInput] = useState("")
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [initializing, setInitializing] = useState(() => !!resolveDashboardPassword())

  const loadLogs = async (password: string, options?: { showLoading?: boolean }) => {
    const showLoading = options?.showLoading ?? true
    if (showLoading) {
      setLoading(true)
      setError(null)
      setAuthError(null)
    }

    try {
      const result = await fetchDashboardLogs(password)
      if (!result.ok) {
        if (result.unauthorized) {
          sessionStorage.removeItem(DASHBOARD_PASSWORD_KEY)
          passwordRef.current = ""
          setIsAuthorized(false)
          setPasswordInput("")
          setAuthError(result.message)
        } else if (showLoading) {
          setAuthError(result.message)
        } else {
          setError(result.message)
        }
        return
      }

      sessionStorage.setItem(DASHBOARD_PASSWORD_KEY, password)
      passwordRef.current = password
      setLogs(result.data)
      setIsAuthorized(true)
      setError(null)
      setAuthError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load items"
      if (showLoading) {
        setAuthError(message)
      } else {
        setError(message)
      }
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    const password = resolveDashboardPassword()
    if (!password) {
      setInitializing(false)
      return
    }

    void loadLogs(password).finally(() => setInitializing(false))
  }, [])

  useEffect(() => {
    if (!isAuthorized) return

    const interval = setInterval(() => {
      void loadLogs(passwordRef.current, { showLoading: false })
    }, POLL_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [isAuthorized])

  const submitPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAuthError(null)
    setError(null)

    if (!passwordInput.trim()) {
      setAuthError("Enter a password.")
      return
    }

    setSubmitting(true)
    await loadLogs(passwordInput.trim(), { showLoading: true })
    setSubmitting(false)
  }

  const handleLogout = () => {
    sessionStorage.removeItem(DASHBOARD_PASSWORD_KEY)
    passwordRef.current = ""
    setIsAuthorized(false)
    setLogs([])
    setPasswordInput("")
    setAuthError(null)
    setError(null)
    setLoading(false)
    setActiveTab("activity")
  }

  return (
    <>
      <main className="tma-gallery-page tma-dashboard">
        <header className="tma-header">
          {isAuthorized && (
            <button
              type="button"
              className="tma-dashboard-logout"
              onClick={handleLogout}
            >
              Log out
            </button>
          )}
          <div className="tma-header-inner">
            <h1 className="tma-page-title">Dashboard</h1>
            <p className="tma-page-subtitle">Live .church activity</p>
          </div>
        </header>

        <div className="tma-content">
          {initializing && (
            <div className="tma-analytics-card tma-dashboard-status-card">
              <p>Restoring dashboard session...</p>
            </div>
          )}
          {!initializing && !isAuthorized && (
            <form className="tma-dashboard-auth" onSubmit={submitPassword}>
              <label htmlFor="dashboard-password">Enter password to access this page</label>
              <input
                id="dashboard-password"
                type="password"
                value={passwordInput}
                onChange={(event) => setPasswordInput(event.target.value)}
                placeholder="Password"
                autoComplete="current-password"
              />
              <button type="submit" disabled={submitting}>
                {submitting ? "Unlocking..." : "Unlock dashboard"}
              </button>
              {authError && <p className="tma-dashboard-error">{authError}</p>}
            </form>
          )}

          {isAuthorized && (
            <>
              <nav className="tma-dashboard-tabs-nav" aria-label="Dashboard views">
                <div className="tma-dashboard-tabs tma-dashboard-tabs--wrap" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "activity"}
                    className={`tma-dashboard-tab ${activeTab === "activity" ? "is-active" : ""}`}
                    onClick={() => setActiveTab("activity")}
                  >
                    Activity
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "counts"}
                    className={`tma-dashboard-tab ${activeTab === "counts" ? "is-active" : ""}`}
                    onClick={() => setActiveTab("counts")}
                  >
                    Link scan counts
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "overview"}
                    className={`tma-dashboard-tab ${activeTab === "overview" ? "is-active" : ""}`}
                    onClick={() => setActiveTab("overview")}
                  >
                    Overview
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "audience"}
                    className={`tma-dashboard-tab ${activeTab === "audience" ? "is-active" : ""}`}
                    onClick={() => setActiveTab("audience")}
                  >
                    Audience
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "sar"}
                    className={`tma-dashboard-tab tma-dashboard-tab--span-2${activeTab === "sar" ? " is-active" : ""}`}
                    onClick={() => setActiveTab("sar")}
                  >
                    Live sessions
                  </button>
                </div>
              </nav>

              {loading && (
                <div className="tma-analytics-card tma-dashboard-status-card">
                  <p>Loading poise_log entries...</p>
                </div>
              )}
              {error && <p className="tma-dashboard-error">Error: {error}</p>}
              <SiteScopeProvider scope="church_of_england">
                {!loading && !error && activeTab === "activity" && (
                  <DashboardActivityPanel logs={logs} />
                )}
                {!loading && !error && activeTab === "counts" && (
                  <DashboardCountsPanel logs={logs} />
                )}
                {!loading && !error && activeTab === "overview" && (
                  <DashboardOverviewPanel logs={logs} />
                )}
                {!loading && !error && activeTab === "audience" && (
                  <DashboardAudiencePanel logs={logs} />
                )}
                {!loading && !error && activeTab === "sar" && (
                  <DashboardSarTimelinePanel logs={logs} />
                )}
              </SiteScopeProvider>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Dashboard
```

- [ ] **Step 2: Wire `/dashboard` in `App.tsx`**

Replace the ExternalDashboardRedirect import with:

```tsx
import Dashboard from "./pages/Dashboard"
```

Replace the `/dashboard` route with:

```tsx
        <Route path="/dashboard" element={<Dashboard />} />
```

- [ ] **Step 3: Delete `ExternalDashboardRedirect.tsx`**

```bash
rm apps/church_of_england/src/components/ExternalDashboardRedirect.tsx
```

Confirm no remaining imports:

```bash
rg ExternalDashboardRedirect apps/church_of_england
```

Expected: no matches.

- [ ] **Step 4: Build**

Run: `npm run build -w @tma/app-church-of-england`

Expected: PASS. `dist/_redirects` must contain `/api/*` (if env set) and `/*    /index.html   200`, and must **not** contain `/dashboard` 301 lines.

- [ ] **Step 5: Commit**

```bash
git add \
  apps/church_of_england/src/pages/Dashboard.tsx \
  apps/church_of_england/src/App.tsx \
  apps/church_of_england/src/components/ExternalDashboardRedirect.tsx
git commit -m "Host the church analytics dashboard on /dashboard."
```

---

### Task 3: Docs and env example

**Files:**
- Modify: `apps/church_of_england/.env.example`
- Modify: `apps/church_of_england/netlify.toml`
- Modify: `apps/church_of_england/README.md`

**Interfaces:**
- Consumes: Task 2 in-app `/dashboard`
- Produces: docs that describe the local dashboard, not the Arkin redirect

- [ ] **Step 1: Update `.env.example`**

```
VITE_API_PROXY_TARGET=
VITE_DASHBOARD_PASSWORD=

# Optional — section audio generation (npm run audio:sections)
# ELEVENLABS_API_KEY=sk_...
# ELEVENLABS_VOICE_ID=                 # default English sections
# ELEVENLABS_VOICE_ID_REV=McCpKDz9Fm00UGapoXxs  # Southwell donate (Reverend) — separate from ELEVENLABS_VOICE_ID
# ELEVENLABS_MODEL_ID=eleven_multilingual_v2
```

- [ ] **Step 2: Update `netlify.toml` comment**

Replace the `/dashboard redirects to arkin...` comment with:

```
# /dashboard is served by the SPA (in-app analytics). Vite writes dist/_redirects
# with /api/* proxy + /* → /index.html (no off-site /dashboard 301).
```

- [ ] **Step 3: Update README**

Replace the Local dev env sentence with:

```
Copy `.env.example` to `.env.local` and set `VITE_API_PROXY_TARGET`. Optional: `VITE_DASHBOARD_PASSWORD` to auto-unlock `/dashboard` in local dev.

`/dashboard` is the church-only analytics dashboard (same tabs as Arkin). Church tags also remain on the main dashboard at `https://arkin.takemearound.gallery` (scope Church of England).
```

- [ ] **Step 4: Commit**

```bash
git add \
  apps/church_of_england/.env.example \
  apps/church_of_england/netlify.toml \
  apps/church_of_england/README.md
git commit -m "Document the church in-app dashboard."
```

---

## Spec coverage

| Spec item | Task |
|-----------|------|
| In-app `/dashboard` on church site | Task 2 |
| Arkin auth + poll + five tabs | Task 2 |
| `church_of_england` scope | Task 2 |
| Church header/footer, subtitle | Task 2 |
| Session key + env password win | Task 2 |
| No `X-Dashboard-App` | Task 2 |
| `apiBaseUrl` church hosts | Task 1 |
| `parseApiJson` | Task 1 |
| Drop 301 redirects | Task 1 + 2 |
| Vite aliases | Task 1 |
| Main dashboard unchanged | (no task) |
| Docs / env example | Task 3 |
| Build verification | Task 2 Step 4 |

## Manual smoke (after Task 3)

1. `npm run dev:church-of-england` → open `/dashboard` — stays on church origin.
2. Login with `VITE_DASHBOARD_PASSWORD` from `.env.local`.
3. Confirm Westminster Abbey and Southwell Minster only; click all five tabs; log out.
4. Wrong password → “Incorrect password.”
5. `/westminster-abbey` and Southwell still render.
