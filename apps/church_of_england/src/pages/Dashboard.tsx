import { type CSSProperties, useEffect, useState } from "react"
import Footer from "../components/Footer"
import {
  DashboardActivityPanel,
  DashboardAudiencePanel,
  DashboardCountsPanel,
  DashboardOverviewPanel,
  DashboardSarTimelinePanel,
  DashboardTabsNav,
  SiteScopeProvider,
  type DashboardTabId,
} from "@tma/dashboard-ui"
import { apiBaseUrl, apiNeedsNgrokHeader } from "../apiBaseUrl"
import { parseApiJson } from "../parseApiJson"
import type { PoiseLog } from "@tma/dashboard-scope"
import westFront from "../assets/church-of-england/images/southwell/west-front.jpg"
import "../styles/style.css"
import "../styles/southwell-minster.css"
import "../styles/southwell-dashboard.css"

const POLL_INTERVAL_MS = 5000

type DashboardTab = DashboardTabId

type FetchLogsResult =
  | { ok: true; data: PoiseLog[] }
  | { ok: false; unauthorized: boolean; message: string }

async function fetchDashboardLogs(): Promise<FetchLogsResult> {
  const base = apiBaseUrl()
  const url = base ? `${base}/api/secure/items` : "/api/secure/items"
  const headers: Record<string, string> = {}
  if (apiNeedsNgrokHeader()) {
    headers["ngrok-skip-browser-warning"] = "true"
  }
  const response = await fetch(url, { headers })

  if (response.status === 401) {
    return {
      ok: false,
      unauthorized: true,
      message: "Dashboard API access was denied.",
    }
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
        "API not reachable (404). Check Flask is running and VITE_API_PROXY_TARGET matches the API host.",
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
  const [logs, setLogs] = useState<PoiseLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [activeTab, setActiveTab] = useState<DashboardTab>("activity")

  const loadLogs = async (options?: { showLoading?: boolean }) => {
    const showLoading = options?.showLoading ?? true
    if (showLoading) {
      setLoading(true)
      setError(null)
    }

    try {
      const result = await fetchDashboardLogs()
      if (!result.ok) {
        if (showLoading) {
          setError(result.message)
        }
        return false
      }

      setLogs(result.data)
      setReady(true)
      setError(null)
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load items"
      if (showLoading) {
        setError(message)
      }
      return false
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    void loadLogs({ showLoading: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount
  }, [])

  useEffect(() => {
    if (!ready) return

    const interval = setInterval(() => {
      void loadLogs({ showLoading: false })
    }, POLL_INTERVAL_MS)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- poll after first successful load
  }, [ready])

  const heroStyle = {
    "--southwell-hero-image": `url(${westFront})`,
  } as CSSProperties

  return (
    <div className="southwell-minster southwell-dashboard tma-dashboard">
      <header className="hero southwell-dashboard-hero" role="banner" style={heroStyle}>
        <div className="hero-inner">
          <div className="eyebrow">Take Me Around · .church</div>
          <h1>Dashboard</h1>
          <p className="tagline">Live .church activity</p>
        </div>
      </header>

      <div className="tma-content">
        <DashboardTabsNav
          className="southwell-dashboard-tabs-nav"
          activeTab={activeTab}
          onChange={setActiveTab}
        />

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
      </div>
      <Footer />
    </div>
  )
}

export default Dashboard
