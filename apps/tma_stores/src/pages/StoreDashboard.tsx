import { useEffect, useState } from "react"
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
import charlesLogo from "../assets/charles-peters-logo-header.png"
import waitburysLogo from "../assets/waitburys-logo-header.png"
import "../../../dashboard/src/styles/style.css"
import "../styles/store-dashboard.css"

const POLL_INTERVAL_MS = 5000

type FetchLogsResult =
  | { ok: true; data: PoiseLog[] }
  | { ok: false; message: string }

async function fetchDashboardLogs(): Promise<FetchLogsResult> {
  const response = await fetch("/api/secure/items")
  if (response.status === 401) {
    return { ok: false, message: "Dashboard API access was denied." }
  }
  if (!response.ok) {
    return { ok: false, message: `Request failed with status ${response.status}` }
  }
  const data = (await response.json()) as PoiseLog[]
  return { ok: true, data }
}

const STORES = {
  waitburys: {
    scope: "waitburys" as const,
    title: "Waitburys",
    logo: waitburysLogo,
  },
  charles_peters: {
    scope: "charles_peters" as const,
    title: "Charles Peters",
    logo: charlesLogo,
  },
}

export default function StoreDashboard({ store }: { store: keyof typeof STORES }) {
  const config = STORES[store]
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
    <div className={`tma-dashboard store-dashboard store-dashboard--${store}`}>
      <header className="tma-header store-dashboard-header">
        <div>
          <p className="store-dashboard-kicker">Take Me Around.stores</p>
          <h1>
            <img className="store-dashboard-logo" src={config.logo} alt={config.title} />
          </h1>
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
        <SiteScopeProvider scope={config.scope}>
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
