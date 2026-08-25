import { type CSSProperties, type FormEvent, useEffect, useRef, useState } from "react"
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
import westFront from "../assets/church-of-england/images/southwell/west-front.jpg"
import "../styles/style.css"
import "../styles/southwell-minster.css"
import "../styles/southwell-dashboard.css"

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

  const heroStyle = {
    "--southwell-hero-image": `url(${westFront})`,
  } as CSSProperties

  return (
    <div className="southwell-minster southwell-dashboard tma-dashboard">
      <header className="hero southwell-dashboard-hero" role="banner" style={heroStyle}>
        {isAuthorized && (
          <button
            type="button"
            className="tma-dashboard-logout"
            onClick={handleLogout}
          >
            Log out
          </button>
        )}
        <div className="hero-inner">
          <div className="eyebrow">Take Me Around · .church</div>
          <h1>Dashboard</h1>
          <p className="tagline">Live .church activity</p>
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
              <nav className="tma-dashboard-tabs-nav southwell-dashboard-tabs-nav" aria-label="Dashboard views">
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
      <Footer />
    </div>
  )
}

export default Dashboard
