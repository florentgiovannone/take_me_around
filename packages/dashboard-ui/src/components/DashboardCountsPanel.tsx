import { useMemo } from "react"
import AnalyticsStatCard from "./AnalyticsStatCard"
import { useSiteAnalyticsScope } from "../hooks/useSiteAnalyticsScope"
import { formatLogTimestamp } from "../utils/dashboardFormatters"
import {
  buildTrackedArtworkScanGroups,
  formatAndroidField,
  formatNumber,
  trackedArtworkCount,
  trackedLinksMeta,
  trackedScansAcrossMeta,
  type PoiseLog,
} from "@tma/dashboard-scope"

type DashboardCountsPanelProps = {
  logs: PoiseLog[]
}

function TimestampCell({ value }: { value: string | null }) {
  const formatted = formatLogTimestamp(value)
  if (!formatted) return <>-</>

  return (
    <>
      <div>{formatted.date}</div>
      <div className="tma-dashboard-muted">{formatted.time}</div>
    </>
  )
}

export default function DashboardCountsPanel({ logs }: DashboardCountsPanelProps) {
  const siteScope = useSiteAnalyticsScope()
  const artworkScanGroups = useMemo(
    () => buildTrackedArtworkScanGroups(logs, siteScope),
    [logs, siteScope]
  )
  const linkCount = trackedArtworkCount(siteScope)

  const totalScans = artworkScanGroups.reduce((sum, group) => sum + group.scans.length, 0)
  const activeLinks = artworkScanGroups.filter((group) => group.scans.length > 0).length
  const topLink = artworkScanGroups[0]

  return (
    <div className="tma-analytics-panel">
      <div className="tma-analytics-stats tma-analytics-stats--3">
        <AnalyticsStatCard
          label="Total Scans"
          value={formatNumber(totalScans)}
          meta={trackedScansAcrossMeta(siteScope)}
          icon={
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 4h6v16H4V4zm10 8h6v8h-6v-8z" fill="currentColor" />
            </svg>
          }
        />
        <AnalyticsStatCard
          label="Active Links"
          value={formatNumber(activeLinks)}
          meta={trackedLinksMeta(siteScope)}
          icon={
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h16v3H4V7zm0 5h10v3H4v-3zm0 5h7v3H4v-3z" fill="currentColor" />
            </svg>
          }
        />
        <AnalyticsStatCard
          label="Top Link"
          value={topLink?.scans.length ? topLink.title : "—"}
          valueClassName="tma-analytics-stat-value--text"
          meta={topLink?.scans.length ? `${formatNumber(topLink.scans.length)} scans` : "no data yet"}
          metaClassName="is-accent"
          icon={
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.8 7.2 18l.9-5.4L4.2 8.7l5.4-.8L12 3z"
                fill="currentColor"
              />
            </svg>
          }
        />
      </div>

      <section className="tma-analytics-card">
        <div className="tma-analytics-card-header">
          <h2>Link Scan Counts</h2>
          <span className="tma-dashboard-count-pill">
            {formatNumber(linkCount)} links
          </span>
        </div>

        <div className="tma-dashboard-link-cards">
          {artworkScanGroups.map((group) => (
            <details key={group.path} className="tma-dashboard-link-card">
              <summary>
                <div className="tma-dashboard-link-card-main">
                  <span className="tma-dashboard-link-card-title">{group.title}</span>
                  <span className="tma-dashboard-link-card-url">{group.url}</span>
                </div>
                <span className="tma-dashboard-scan-count">{group.scans.length} scans</span>
              </summary>

              {group.scans.length > 0 && (
                <div className="tma-dashboard-table-wrap tma-dashboard-table-wrap--inset">
                  <table className="tma-dashboard-nested-table tma-dashboard-nested-table--modern">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Type</th>
                        <th>Android</th>
                        <th>ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.scans.map((scan) => (
                        <tr key={scan.int_id}>
                          <td data-label="Time">
                            <TimestampCell value={scan.dtm_timestamp} />
                          </td>
                          <td data-label="Type">{scan.txt_message_type ?? "-"}</td>
                          <td data-label="Android">{formatAndroidField(scan)}</td>
                          <td data-label="ID">{scan.int_id}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </details>
          ))}
        </div>
      </section>
    </div>
  )
}
