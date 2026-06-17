import { useMemo } from "react"
import AnalyticsStatCard from "./AnalyticsStatCard"
import DashboardActivityTableRow from "./DashboardActivityTableRow"
import { useSiteAnalyticsScope } from "../hooks/useSiteAnalyticsScope"
import { formatRelativeTime } from "../utils/dashboardFormatters"
import {
  buildActivityEntries,
  emptyActivityMessage,
  formatNumber,
  parseLogTimestampGmt,
  trackedLinksMeta,
  trackedScansMeta,
} from "@tma/dashboard-scope"

type DashboardActivityPanelProps = {
  logs: import("@tma/dashboard-scope").PoiseLog[]
}

export default function DashboardActivityPanel({ logs }: DashboardActivityPanelProps) {
  const siteScope = useSiteAnalyticsScope()
  const activityEntries = useMemo(
    () => buildActivityEntries(logs, siteScope),
    [logs, siteScope]
  )

  const uniqueArtworks = useMemo(
    () => new Set(activityEntries.map((entry) => entry.artworkTitle).filter(Boolean)).size,
    [activityEntries]
  )

  const latestScan = useMemo(() => {
    let best: string | null = null
    let bestMs = -1
    for (const entry of activityEntries) {
      if (!entry.timestamp) continue
      const ms = parseLogTimestampGmt(entry.timestamp)?.getTime() ?? -1
      if (ms > bestMs) {
        bestMs = ms
        best = entry.timestamp
      }
    }
    return best
  }, [activityEntries])

  return (
    <div className="tma-analytics-panel">
      <div className="tma-analytics-stats tma-analytics-stats--3">
        <AnalyticsStatCard
          label="Total Events"
          value={formatNumber(activityEntries.length)}
          meta={trackedScansMeta(siteScope)}
          icon={
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 4h6v16H4V4zm10 8h6v8h-6v-8z" fill="currentColor" />
            </svg>
          }
        />
        <AnalyticsStatCard
          label="Artworks"
          value={formatNumber(uniqueArtworks)}
          meta={trackedLinksMeta(siteScope)}
          icon={
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.8 7.2 18l.9-5.4L4.2 8.7l5.4-.8L12 3z"
                fill="currentColor"
              />
            </svg>
          }
        />
        <AnalyticsStatCard
          label="Latest Scan"
          value={formatRelativeTime(latestScan)}
          valueClassName="tma-analytics-stat-value--text"
          meta="updates every 5s"
          metaClassName="is-accent"
          icon={
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 6v6l4 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          }
        />
      </div>

      <section className="tma-analytics-card">
        <div className="tma-analytics-card-header">
          <h2>Live Activity</h2>
          <span className="tma-dashboard-live-badge">Live</span>
        </div>

        <div className="tma-dashboard-table-wrap tma-dashboard-table-wrap--inset">
          <table className="tma-dashboard-table tma-dashboard-table--activity-modern">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Artwork</th>
                <th>Time</th>
                <th>Type</th>
                <th>Seen?</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {activityEntries.map((entry) => (
                <DashboardActivityTableRow
                  key={entry.key}
                  entry={entry}
                  logs={logs}
                  scope={siteScope}
                />
              ))}
              {activityEntries.length === 0 && (
                <tr className="tma-dashboard-table-empty">
                  <td colSpan={6}>{emptyActivityMessage(siteScope)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
