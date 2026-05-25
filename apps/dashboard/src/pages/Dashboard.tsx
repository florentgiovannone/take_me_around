import { type FormEvent, useEffect, useMemo, useRef, useState } from "react"
import ScopeSwitcher from "../components/ScopeSwitcher"
import {
  DashboardActivityPanel,
  DashboardAudiencePanel,
  DashboardCountsPanel,
  DashboardOverviewPanel,
  DashboardSarTimelinePanel,
  SiteScopeProvider,
} from "@tma/dashboard-ui"
import { apiBaseUrl, apiNeedsNgrokHeader } from "../apiBaseUrl"
import {
  clearOperatorSession,
  defaultScopeForOperator,
  getStoredOperatorId,
  getStoredScope,
  normalizeScopeForOperator,
  OPERATORS,
  resolveOperator,
  siteScopesForOperator,
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
import { parseApiJson } from "../parseApiJson"
import type { PoiseLog } from "@tma/dashboard-scope"

const DASHBOARD_PASSWORD_KEY = "tma-main-dashboard-password"
const POLL_INTERVAL_MS = 5000

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

  const showOperatorPickerOnLogin = OPERATORS.length > 1 && !fixedScope

  const allowedScopes = useMemo(() => {
    if (!operator) return []
    const scopes = siteScopesForOperator(operator)
    if (fixedScope) {
      return scopes.filter((scope) => scope === fixedScope)
    }
    return scopes
  }, [operator, fixedScope])

  const applyOperatorSession = (nextOperator: OperatorProfile) => {
    storeOperatorSession(nextOperator.id)
    setOperator(nextOperator)
    const scopes = fixedScope
      ? siteScopesForOperator(nextOperator).filter((s) => s === fixedScope)
      : siteScopesForOperator(nextOperator)
    const nextScope = normalizeScopeForOperator(getStoredScope(), nextOperator)
    const resolved =
      fixedScope && scopes.includes(fixedScope)
        ? fixedScope
        : scopes.includes(nextScope)
          ? nextScope
          : scopes[0] ?? defaultScopeForOperator(nextOperator)
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
  }

  const showAnalytics = isAuthorized && operator !== null && activeScope !== null

  return (
    <main
      className={`tma-dashboard tma-main-dashboard${activeScope === "gallery" ? " tma-gallery-page" : ""}`}
    >
      <header
        className={
          fixedScope ? "tma-header" : "tma-header tma-main-dashboard-header"
        }
      >
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

        {showAnalytics && (
          <>
            {allowedScopes.length > 1 && (
              <div className="tma-dashboard-scope-bar">
                <ScopeSwitcher
                  scopes={allowedScopes}
                  value={activeScope}
                  onChange={handleScopeChange}
                />
              </div>
            )}

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
      </div>
    </main>
  )
}

export default Dashboard
