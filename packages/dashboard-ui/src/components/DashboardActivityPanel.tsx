import { useMemo, useState } from "react"
import AnalyticsStatCard from "./AnalyticsStatCard"
import { useSiteAnalyticsScope } from "../hooks/useSiteAnalyticsScope"
import { formatLogTimestamp, formatRelativeTime, messageTypeClass } from "../utils/dashboardFormatters"
import {
  buildActivityEntries,
  buildActivityVisitDetails,
  emptyActivityMessage,
  formatNumber,
  parseLogTimestampGmt,
  trackedLinksMeta,
  trackedScansMeta,
  type ActivityEntry,
  type ActivityVisitDetails,
  type PoiseLog,
} from "@tma/dashboard-scope"

type DashboardActivityPanelProps = {
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

function DetailField({ label, value }: { label: string; value: string | number | null | undefined }) {
  const displayValue = value === null || value === undefined || value === "" ? "—" : String(value)

  return (
    <div className="tma-dashboard-activity-detail-field">
      <span className="tma-dashboard-activity-detail-label">{label}</span>
      <span className="tma-dashboard-activity-detail-value">{displayValue}</span>
    </div>
  )
}

function VisitDetailsSection({ details }: { details: ActivityVisitDetails }) {
  return (
    <section className="tma-dashboard-activity-detail-section">
      <div className="tma-dashboard-activity-detail-grid">
        <DetailField label="Tag UID" value={details.tagUid} />
        <DetailField label="Device" value={details.device} />
        <DetailField label="Browser" value={details.browser} />
        <DetailField label="Operating system" value={details.os} />
        <DetailField label="Language" value={details.language} />
        <DetailField label="IP address" value={details.ipAddress} />
      </div>
      {details.sar && (
        <div className="tma-dashboard-activity-detail-sar">
          <span className="tma-dashboard-activity-detail-label">SAR</span>
          <p>{details.sar}</p>
        </div>
      )}
      {details.userAgent && (
        <div className="tma-dashboard-activity-detail-user-agent">
          <span className="tma-dashboard-activity-detail-label">User agent</span>
          <p>{details.userAgent}</p>
        </div>
      )}
    </section>
  )
}

function ActivityDetailsPanel({ entry }: { entry: ActivityEntry }) {
  return (
    <div className="tma-dashboard-activity-details-panel">
      {entry.seen.map((seenRow) => (
        <VisitDetailsSection
          key={seenRow.int_id}
          details={buildActivityVisitDetails(seenRow)}
        />
      ))}
    </div>
  )
}

function ActivityRow({ entry }: { entry: ActivityEntry }) {
  const [expanded, setExpanded] = useState(false)
  const hasVisitDetails = entry.seen.length > 0
  const messageType = entry.redirect?.txt_message_type ?? entry.seen[0]?.txt_message_type ?? "-"
  const logId = entry.redirect?.int_id ?? entry.seen[0]?.int_id ?? "—"

  return (
    <>
      <tr className={expanded ? "is-expanded" : undefined}>
        <td data-label="Log ID">{logId}</td>
        <td data-label="Artwork">{entry.artworkTitle}</td>
        <td data-label="Time">
          <TimestampCell value={entry.timestamp} />
        </td>
        <td data-label="Type">
          <div className="tma-dashboard-activity-type">
            <span className={`tma-dashboard-type-badge ${messageTypeClass(messageType)}`}>
              {messageType}
            </span>
            {hasVisitDetails && (
              <button
                type="button"
                className={`tma-dashboard-activity-expand${expanded ? " is-open" : ""}`}
                aria-expanded={expanded}
                aria-label={expanded ? "Hide visit details" : "Show visit details"}
                onClick={() => setExpanded((open) => !open)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M6 9l6 6 6-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        </td>
        <td data-label="Link" className="tma-dashboard-link-cell">
          {entry.link}
        </td>
      </tr>
      {expanded && hasVisitDetails && (
        <tr className="tma-dashboard-activity-details-row">
          <td colSpan={5}>
            <ActivityDetailsPanel entry={entry} />
          </td>
        </tr>
      )}
    </>
  )
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
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {activityEntries.map((entry) => (
                <ActivityRow key={entry.key} entry={entry} />
              ))}
              {activityEntries.length === 0 && (
                <tr className="tma-dashboard-table-empty">
                  <td colSpan={5}>{emptyActivityMessage(siteScope)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
