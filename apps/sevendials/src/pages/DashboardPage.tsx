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
import SevenDialsRoundel from "../components/SevenDialsRoundel"
import { plaques } from "../plaques"
import "../../../dashboard/src/styles/style.css"
import "../styles/dashboard.css"

const POLL_INTERVAL_MS = 5000

type FetchLogsResult =
  | { ok: true; data: PoiseLog[] }
  | { ok: false; message: string }

async function fetchDashboardLogs(): Promise<FetchLogsResult> {
  try {
    const response = await fetch("/api/secure/items")
    if (response.status === 401) {
      return { ok: false, message: "Dashboard API access was denied." }
    }
    if (response.status === 503) {
      return { ok: false, message: "Server is not configured for secure access." }
    }
    if (!response.ok) {
      return { ok: false, message: `Request failed with status ${response.status}` }
    }
    const data = (await response.json()) as PoiseLog[]
    if (!Array.isArray(data)) {
      return { ok: false, message: "Unexpected API payload format." }
    }
    return { ok: true, data }
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Failed to load items",
    }
  }
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
    <div className="tma-dashboard sevendials-dashboard">
      <nav className="sd-topbar" aria-label="Seven Dials navigation">
        <div className="sd-topbar-inner">
          <Link to="/" className="sd-brand-link">
            <span className="sd-brand-dot" aria-hidden="true" />
            <span>Seven Dials Trust · People&apos;s Plaques</span>
          </Link>
        </div>
      </nav>

      <header className="tma-header sevendials-dashboard-header" role="banner">
        <div className="sevendials-dashboard-header-inner">
          <div className="sevendials-dashboard-badge">
            <SevenDialsRoundel size={136} showPromptText={false} />
          </div>
          <div className="sevendials-dashboard-heading">
            <p className="sevendials-dashboard-eyebrow">
              Seven Dials Trust · Covent Garden, London
            </p>
            <h1>People&apos;s Plaques Dashboard</h1>
            <p className="sevendials-dashboard-subtitle">
              Live NFC roundel telemetry for Charles Boon (SD001) &amp; Brian Epstein (SD002)
            </p>
            <div className="sevendials-dashboard-plaque-pills">
              {plaques.map((person) => (
                <Link
                  key={person.slug}
                  to={`/${person.slug}`}
                  className="sevendials-dashboard-pill"
                >
                  <span className="sevendials-dashboard-pill-code">{person.tagCode}</span>
                  <span>
                    {person.name} ({person.lifeDates}) · {person.locationTitle}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="tma-content">
        <DashboardTabsNav
          className="sevendials-dashboard-tabs-nav"
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {loading && (
          <div className="tma-analytics-card tma-dashboard-status-card">
            <p>Loading Seven Dials plaque activity...</p>
          </div>
        )}
        {error && <p className="tma-dashboard-error">Error: {error}</p>}

        <SiteScopeProvider scope="sevendials">
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

      <footer className="sd-footer">
        <div className="sd-footer-inner">
          <div>
            <strong>Seven Dials Trust · People&apos;s Plaques</strong>
            <p>Colours and crest derived from the Seven Dials Trust NFC roundel.</p>
          </div>
          <div className="sd-footer-links">
            <Link to="/charles-boon">Charles Boon (SD001)</Link>
            <Link to="/brian-epstein">Brian Epstein (SD002)</Link>
            <Link to="/allpages">All Pages</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
