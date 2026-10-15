import { useEffect, useState } from "react"
import { useUiCopy } from "../i18n/locale"
import { fill } from "../i18n/uiCopy"
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
import { mergeArtworkScans } from "../artworkScans"
import FriezeLogo from "../components/FriezeLogo"
import "../../../dashboard/src/styles/style.css"
import "../styles/dashboard.css"

const POLL_INTERVAL_MS = 5000

type FetchLogsResult =
  | { ok: true; data: PoiseLog[] }
  | { ok: false; code: "denied" | "unconfigured" | "unexpected" | "status"; status?: number }

async function fetchDashboardLogs(): Promise<FetchLogsResult> {
  const response = await fetch("/api/secure/items")
  if (response.status === 401) return { ok: false, code: "denied" }
  if (response.status === 503) return { ok: false, code: "unconfigured" }
  if (!response.ok) return { ok: false, code: "status", status: response.status }
  const data = (await response.json()) as PoiseLog[]
  if (!Array.isArray(data)) return { ok: false, code: "unexpected" }
  return { ok: true, data }
}

export default function DashboardPage() {
  const copy = useUiCopy()
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
        setLogs((current) => mergeArtworkScans(showLoading ? [] : current))
        if (showLoading) {
          const message =
            result.code === "denied"
              ? copy.dashboardDenied
              : result.code === "unconfigured"
                ? copy.dashboardUnconfigured
                : result.code === "unexpected"
                  ? copy.dashboardUnexpected
                  : fill(copy.dashboardStatus, { status: String(result.status ?? "") })
          setError(message)
        }
        setReady(true)
        return
      }
      setLogs(mergeArtworkScans(result.data))
      setReady(true)
      setError(null)
    } catch {
      setLogs((current) => mergeArtworkScans(showLoading ? [] : current))
      setReady(true)
      if (showLoading) {
        setError(copy.dashboardFailed)
      }
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  useEffect(() => {
    const previousTitle = document.title
    document.title = `${copy.dashboard} | Frieze Gallery`
    return () => {
      document.title = previousTitle
    }
  }, [copy.dashboard])

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
    <div className="tma-dashboard frieze-gallery-dashboard">
      <header className="tma-header frieze-gallery-dashboard-header">
        <div>
          <p className="frieze-gallery-dashboard-kicker">
            <FriezeLogo />
          </p>
          <h1>{copy.dashboard}</h1>
        </div>
      </header>
      <div className="tma-content">
        <DashboardTabsNav activeTab={activeTab} onChange={setActiveTab} />
        {loading && (
          <div className="tma-analytics-card tma-dashboard-status-card">
            <p>{copy.loadingActivity}</p>
          </div>
        )}
        {error && logs.length === 0 && (
          <p className="tma-dashboard-error">{fill(copy.errorPrefix, { message: error })}</p>
        )}
        <SiteScopeProvider scope="frieze_gallery">
          {!loading && (logs.length > 0 || !error) && activeTab === "activity" && (
            <DashboardActivityPanel logs={logs} />
          )}
          {!loading && (logs.length > 0 || !error) && activeTab === "counts" && (
            <DashboardCountsPanel logs={logs} />
          )}
          {!loading && (logs.length > 0 || !error) && activeTab === "overview" && (
            <DashboardOverviewPanel logs={logs} />
          )}
          {!loading && (logs.length > 0 || !error) && activeTab === "audience" && (
            <DashboardAudiencePanel logs={logs} />
          )}
          {!loading && (logs.length > 0 || !error) && activeTab === "sar" && (
            <DashboardSarTimelinePanel logs={logs} />
          )}
        </SiteScopeProvider>
      </div>
    </div>
  )
}
