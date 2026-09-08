import { useState } from "react"
import type { SiteScope } from "@tma/config"
import { useDashboardCopy } from "../hooks/useSiteAnalyticsScope"
import { formatLogTimestamp, messageTypeClass } from "../utils/dashboardFormatters"
import {
  buildActivityVisitDetails,
  type ActivityEntry,
  type ActivityVisitDetails,
  type PoiseLog,
} from "@tma/dashboard-scope"

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
  const copy = useDashboardCopy()
  return (
    <section className="tma-dashboard-activity-detail-section">
      <div className="tma-dashboard-activity-detail-grid">
        <DetailField label={copy.tagUid} value={details.tagUid} />
        <DetailField label={copy.device} value={details.device} />
        <DetailField label={copy.browser} value={details.browser} />
        <DetailField label={copy.os} value={details.os} />
        <DetailField label={copy.language} value={details.language} />
        <DetailField label={copy.ipAddress} value={details.ipAddress} />
      </div>
      {details.sar && (
        <div className="tma-dashboard-activity-detail-sar">
          <span className="tma-dashboard-activity-detail-label">SAR</span>
          <p>{details.sar}</p>
        </div>
      )}
      {details.userAgent && (
        <div className="tma-dashboard-activity-detail-user-agent">
          <span className="tma-dashboard-activity-detail-label">{copy.userAgent}</span>
          <p>{details.userAgent}</p>
        </div>
      )}
    </section>
  )
}

function ActivityDetailsPanel({
  entry,
  logs,
  scope,
}: {
  entry: ActivityEntry
  logs: PoiseLog[]
  scope: SiteScope
}) {
  return (
    <div className="tma-dashboard-activity-details-panel">
      {entry.seen.map((seenRow) => (
        <VisitDetailsSection
          key={seenRow.int_id}
          details={buildActivityVisitDetails(seenRow, logs, scope)}
        />
      ))}
    </div>
  )
}

function renderDashboardLink(link: string) {
  if (/^https?:\/\//i.test(link)) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer">
        {link}
      </a>
    )
  }
  return link
}

function SeenCell({ seen }: { seen: boolean }) {
  const copy = useDashboardCopy()
  return (
    <td data-label={copy.seen} className="tma-dashboard-seen-cell">
      {seen ? (
        <span className="tma-dashboard-seen-tick" aria-label={copy.pageSeen}>
          ✓
        </span>
      ) : (
        <span className="tma-dashboard-seen-empty" aria-hidden="true">
          —
        </span>
      )}
    </td>
  )
}

type DashboardActivityTableRowProps = {
  entry: ActivityEntry
  logs: PoiseLog[]
  scope: SiteScope
  showLogId?: boolean
}

export default function DashboardActivityTableRow({
  entry,
  logs,
  scope,
  showLogId = true,
}: DashboardActivityTableRowProps) {
  const copy = useDashboardCopy()
  const [expanded, setExpanded] = useState(false)
  const hasVisitDetails = entry.seen.length > 0
  const messageType = entry.redirect?.txt_message_type ?? entry.seen[0]?.txt_message_type ?? "-"
  const logId = entry.redirect?.int_id ?? entry.seen[0]?.int_id ?? "—"
  const detailColSpan = showLogId ? 6 : 5

  return (
    <>
      <tr className={expanded ? "is-expanded" : undefined}>
        {showLogId && <td data-label={copy.logId}>{logId}</td>}
        <td data-label={copy.artwork}>{entry.artworkTitle}</td>
        <td data-label={copy.time}>
          <TimestampCell value={entry.timestamp} />
        </td>
        <td data-label={copy.type}>
          <div className="tma-dashboard-activity-type">
            <span className={`tma-dashboard-type-badge ${messageTypeClass(messageType)}`}>
              {messageType}
            </span>
            {hasVisitDetails && (
              <button
                type="button"
                className={`tma-dashboard-activity-expand${expanded ? " is-open" : ""}`}
                aria-expanded={expanded}
                aria-label={expanded ? copy.hideVisitDetails : copy.showVisitDetails}
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
        <SeenCell seen={hasVisitDetails} />
        <td data-label={copy.link} className="tma-dashboard-link-cell">
          {renderDashboardLink(entry.link)}
        </td>
      </tr>
      {expanded && hasVisitDetails && (
        <tr className="tma-dashboard-activity-details-row">
          <td colSpan={detailColSpan}>
            <ActivityDetailsPanel entry={entry} logs={logs} scope={scope} />
          </td>
        </tr>
      )}
    </>
  )
}
