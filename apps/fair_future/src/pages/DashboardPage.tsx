import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
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
import type { PoiseLog } from "@tma/dashboard-scope"
import "../../../dashboard/src/styles/style.css"
import "../styles/dashboard.css"

const POLL_INTERVAL_MS = 5000

type FetchLogsResult =
  | { ok: true; data: PoiseLog[] }
  | { ok: false; message: string }

async function fetchDashboardLogs(): Promise<FetchLogsResult> {
  const response = await fetch("/api/secure/items")
  if (response.status === 401) {
    return { ok: false, message: "Dashboard API access was denied." }
  }
  if (response.status === 503) {
    return { ok: false, message: "Dashboard is not configured." }
  }
  if (!response.ok) {
    return { ok: false, message: `Request failed with status ${response.status}` }
  }
  const data = (await response.json()) as PoiseLog[]
  if (!Array.isArray(data)) {
    return { ok: false, message: "Dashboard API returned an unexpected response." }
  }
  return { ok: true, data }
}

export default function DashboardPage() {
  const [logs, setLogs] = useState<PoiseLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [activeTab, setActiveTab] = useState<DashboardTabId>("activity")

  const loadLogs = async (showLoading: boolean) => {
    if (showLoading) {
      setLoading(true)
      setError(null)
    }
    try {
      const result = await fetchDashboardLogs()
      if (!result.ok) {
        if (showLoading) setError(result.message)
        return
      }
      setLogs(result.data)
      setReady(true)
      setError(null)
    } catch (err) {
      if (showLoading) {
        setError(err instanceof Error ? err.message : "Failed to load items")
      }
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  useEffect(() => {
    const previousTitle = document.title
    document.title = "Fair Future Dashboard"
    return () => {
      document.title = previousTitle
    }
  }, [])

  useEffect(() => {
    void loadLogs(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    const interval = setInterval(() => {
      void loadLogs(false)
    }, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [ready])

  return (
    <div className="tma-dashboard fair-future-dashboard">
      <header className="tma-header fair-future-dashboard-header">
        <div>
          <p className="fair-future-dashboard-kicker">Fair Future Party</p>
          <h1>Dashboard</h1>
          <p>Tags whose names start with PV</p>
          <Link className="fair-future-dashboard-back" to="/">
            Manifesto
          </Link>
        </div>
      </header>
      <div className="tma-content">
        <DashboardTabsNav activeTab={activeTab} onChange={setActiveTab} />
        {loading && (
          <div className="tma-analytics-card tma-dashboard-status-card">
            <p>Loading activity...</p>
          </div>
        )}
        {error && <p className="tma-dashboard-error">Error: {error}</p>}
        <SiteScopeProvider scope="fair_future">
          {!loading && !error && activeTab === "activity" && <DashboardActivityPanel logs={logs} />}
          {!loading && !error && activeTab === "counts" && <DashboardCountsPanel logs={logs} />}
          {!loading && !error && activeTab === "overview" && <DashboardOverviewPanel logs={logs} />}
          {!loading && !error && activeTab === "audience" && <DashboardAudiencePanel logs={logs} />}
          {!loading && !error && activeTab === "sar" && <DashboardSarTimelinePanel logs={logs} />}
        </SiteScopeProvider>
      </div>
    </div>
  )
}
