import { type FormEvent, useEffect, useMemo, useRef, useState } from "react"
import ScopeSwitcher from "../components/ScopeSwitcher"
import DashboardSettingsPage from "../components/DashboardSettingsPage"
import {
  DashboardActivityPanel,
  DashboardAudiencePanel,
  DashboardCountsPanel,
  DashboardOverviewPanel,
  DashboardSarTimelinePanel,
  SiteScopeProvider,
} from "@tma/dashboard-ui"
import {
  apiNeedsNgrokHeader,
  dashboardApiUrl,
  formatDashboardFetchError,
} from "../apiBaseUrl"
import {
  getStoredEnabledSites,
  scopesForEnabledSites,
} from "../config/dashboardSites"
import {
  clearOperatorSession,
  defaultScopeForOperator,
  getStoredOperatorId,
  getStoredScope,
  normalizeScopeForOperator,
  OPERATORS,
  resolveOperator,
  storeOperatorSession,
  storeScope,
  type OperatorProfile,
} from "../config/operators"
import {
  scopeBadgeLabel,
  scopeSubtitle,
  SITE_META,
  type SiteId,
  type SiteScope,
} from "@tma/config"
import { setActiveCombinedSiteIds } from "@tma/dashboard-scope"
import { parseApiJson } from "../parseApiJson"
import type { PoiseLog } from "@tma/dashboard-scope"

const DASHBOARD_PASSWORD_KEY = "tma-main-dashboard-password"
const POLL_INTERVAL_MS = 5000

type DashboardTab = "activity" | "counts" | "overview" | "audience" | "sar"
type DashboardView = "analytics" | "settings"

type FetchLogsResult =
  | { ok: true; data: PoiseLog[] }
  | { ok: false; unauthorized: boolean; message: string }

async function fetchDashboardLogs(password: string): Promise<FetchLogsResult> {
  const url = dashboardApiUrl()
  const headers: Record<string, string> = {
    "X-Dashboard-Password": password,
  }
  if (apiNeedsNgrokHeader()) {
    headers["ngrok-skip-browser-warning"] = "true"
  }
  let response: Response
  try {
    response = await fetch(url, { headers })
  } catch (err) {
    return {
      ok: false,
      unauthorized: false,
      message: formatDashboardFetchError(err, url),
    }
  }

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
        "API not reachable (404). Check Flask + ngrok are running and VITE_API_PROXY_TARGET in .env matches your ngrok URL.",
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

type DashboardProps = {
  /** Lock to one site scope (e.g. /dashboard/museum). Combined is omitted unless allowed. */
  fixedScope?: SiteId
}

function Dashboard({ fixedScope }: DashboardProps) {
  const passwordRef = useRef("")
  const [logs, setLogs] = useState<PoiseLog[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<DashboardTab>("activity")
  const [operator, setOperator] = useState<OperatorProfile | null>(null)
  const [activeScope, setActiveScope] = useState<SiteScope | null>(null)
  const [passwordInput, setPasswordInput] = useState("")
  const [loginOperatorId, setLoginOperatorId] = useState(
    () => resolveOperator().id
  )
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [initializing, setInitializing] = useState(
    () => !!sessionStorage.getItem(DASHBOARD_PASSWORD_KEY)
  )
  const [dashboardView, setDashboardView] = useState<DashboardView>("analytics")
  const [enabledSites, setEnabledSites] = useState<SiteId[]>(() => getStoredEnabledSites())

  const showOperatorPickerOnLogin = OPERATORS.length > 1 && !fixedScope
  const showSettings = !fixedScope

  useEffect(() => {
    setActiveCombinedSiteIds(enabledSites)
  }, [enabledSites])

  useEffect(() => {
    if (!isAuthorized || !activeScope) return
    const scopes = scopesForEnabledSites(enabledSites)
    if (scopes.includes(activeScope)) return
    const next = scopes[0] ?? null
    setActiveScope(next)
    if (next) storeScope(next)
  }, [enabledSites, isAuthorized, activeScope])

  const allowedScopes = useMemo(() => {
    if (fixedScope) {
      return enabledSites.includes(fixedScope) ? [fixedScope] : []
    }
    return scopesForEnabledSites(enabledSites)
  }, [enabledSites, fixedScope])

  const applyOperatorSession = (nextOperator: OperatorProfile) => {
    storeOperatorSession(nextOperator.id)
    setOperator(nextOperator)
    const scopes = allowedScopes
    const nextScope = normalizeScopeForOperator(getStoredScope(), nextOperator, scopes)
    const resolved =
      fixedScope && scopes.includes(fixedScope)
        ? fixedScope
        : scopes.includes(nextScope)
          ? nextScope
          : scopes[0] ?? defaultScopeForOperator(nextOperator, scopes)
    setActiveScope(resolved)
    storeScope(resolved)
  }

  const loadLogs = async (
    password: string,
    options?: { showLoading?: boolean; operatorId?: string }
  ) => {
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
          clearOperatorSession()
          passwordRef.current = ""
          setIsAuthorized(false)
          setOperator(null)
          setActiveScope(null)
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
      if (!operator) {
        applyOperatorSession(
          resolveOperator(options?.operatorId ?? getStoredOperatorId() ?? loginOperatorId)
        )
      }
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
    const savedPassword = sessionStorage.getItem(DASHBOARD_PASSWORD_KEY)
    if (!savedPassword) {
      setInitializing(false)
      return
    }

    void loadLogs(savedPassword, { showLoading: true }).finally(() => setInitializing(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- restore session once on mount
  }, [])

  useEffect(() => {
    if (!isAuthorized) return

    const interval = setInterval(() => {
      void loadLogs(passwordRef.current, { showLoading: false })
    }, POLL_INTERVAL_MS)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- poll only when auth toggles
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
    await loadLogs(passwordInput.trim(), {
      showLoading: true,
      operatorId: loginOperatorId,
    })
    setSubmitting(false)
  }

  const handleScopeChange = (scope: SiteScope) => {
    setActiveScope(scope)
    storeScope(scope)
    setActiveTab("activity")
    setDashboardView("analytics")
  }

  const handleEnabledSitesSave = (sites: SiteId[]) => {
    setEnabledSites(sites)
    setActiveCombinedSiteIds(sites)
    setActiveScope((current) => {
      const scopes = scopesForEnabledSites(sites)
      if (current && scopes.includes(current)) return current
      const next = scopes[0] ?? null
      if (next) storeScope(next)
      return next
    })
  }

  const handleLogout = () => {
    sessionStorage.removeItem(DASHBOARD_PASSWORD_KEY)
    clearOperatorSession()
    passwordRef.current = ""
    setIsAuthorized(false)
    setOperator(null)
    setActiveScope(null)
    setLogs([])
    setPasswordInput("")
    setAuthError(null)
    setError(null)
    setLoading(false)
    setActiveTab("activity")
    setDashboardView("analytics")
  }

  const showAnalytics =
    isAuthorized && operator !== null && activeScope !== null && allowedScopes.length > 0

  return (
    <main
      className={`tma-dashboard tma-main-dashboard${activeScope === "gallery" ? " tma-gallery-page" : ""}`}
    >
      <header
        className={
          fixedScope ? "tma-header" : "tma-header tma-main-dashboard-header"
        }
      >
        {showSettings && (
          <button
            type="button"
            className={`tma-dashboard-settings-btn${dashboardView === "settings" ? " is-active" : ""}`}
            onClick={() =>
              setDashboardView((view) => (view === "settings" ? "analytics" : "settings"))
            }
            aria-label={dashboardView === "settings" ? "Back to dashboard" : "Open dashboard settings"}
            title={dashboardView === "settings" ? "Back to dashboard" : "Dashboard settings"}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                stroke="currentColor"
                strokeWidth="1.75"
              />
              <path
                d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        {isAuthorized && (
          <button
            type="button"
            className="tma-dashboard-logout"
            onClick={handleLogout}
          >
            Log out
          </button>
        )}
        <div
          className={
            fixedScope
              ? "tma-header-inner"
              : "tma-header-inner tma-main-dashboard-header-inner"
          }
        >
          {fixedScope ? (
            <>
              <h1 className="tma-page-title">Dashboard</h1>
              <p className="tma-page-subtitle">{scopeSubtitle(fixedScope)}</p>
            </>
          ) : (
            <>
              <h5 className="tma-main-dashboard-eyebrow">Take Me Around · Analytics</h5>
              <h1 className="tma-page-title tma-main-dashboard-title">
                {activeScope ? (
                  <>Live
                    <span className="tma-main-dashboard-site-badge">
                      {scopeBadgeLabel(activeScope)}
                    </span>
                    Dashboard
                  </>
                ) : (
                  "Dashboard"
                )}
              </h1>
              <p className="tma-page-subtitle tma-main-dashboard-subtitle">
                {activeScope
                  ? ' '
                  : operator
                    ? ' '
                    : "Sign in to continue"}
              </p>
              {operator && (
                <p className="tma-main-dashboard-operator-meta"> </p>
              )}
            </>
          )}
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
            {showOperatorPickerOnLogin && (
              <label htmlFor="dashboard-operator">Operator profile</label>
            )}
            {showOperatorPickerOnLogin && (
              <select
                id="dashboard-operator"
                value={loginOperatorId}
                onChange={(event) => setLoginOperatorId(event.target.value)}
              >
                {OPERATORS.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.name} ({entry.sites.map((s) => SITE_META[s].domainLabel).join(", ")})
                  </option>
                ))}
              </select>
            )}
            <label htmlFor="dashboard-password">Enter password to access this dashboard</label>
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

        {showAnalytics && dashboardView === "settings" && (
          <DashboardSettingsPage
            enabledSites={enabledSites}
            onSave={handleEnabledSitesSave}
            onBack={() => setDashboardView("analytics")}
          />
        )}

        {showAnalytics && dashboardView === "analytics" && (
          <>
            {allowedScopes.length > 1 && (
              <div className="tma-dashboard-scope-bar">
                <ScopeSwitcher
                  scopes={allowedScopes}
                  value={activeScope}
                  onChange={handleScopeChange}
                  combinedSiteIds={enabledSites}
                />
              </div>
            )}

            {allowedScopes.length === 0 && (
              <div className="tma-analytics-card tma-dashboard-status-card">
                <p>
                  No dashboard sites are enabled. Open settings to choose at least one site.
                </p>
              </div>
            )}

            {allowedScopes.length > 0 && (
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
                <SiteScopeProvider scope={activeScope}>
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
          </>
        )}
      </div>
    </main>
  )
}

export default Dashboard
