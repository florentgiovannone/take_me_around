import { type FormEvent, useMemo, useState } from "react"
import AnalyticsStatCard from "./AnalyticsStatCard"
import SarTimelineChart from "./SarTimelineChart"
import { useSiteAnalyticsScope } from "../hooks/useSiteAnalyticsScope"
import { formatLogTimestamp, messageTypeClass } from "../utils/dashboardFormatters"
import {
  buildSarTimelineEvents,
  buildSarTimelinePlot,
  formatNumber,
  listDistinctSars,
  sarTimelineDomainLabel,
  sarTimelineDomainSuffix,
  type PoiseLog,
} from "@tma/dashboard-scope"

type DashboardSarTimelinePanelProps = {
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

export default function DashboardSarTimelinePanel({ logs }: DashboardSarTimelinePanelProps) {
  const siteScope = useSiteAnalyticsScope()
  const [sarInput, setSarInput] = useState("")
  const [activeSar, setActiveSar] = useState("")

  const knownSars = useMemo(() => listDistinctSars(logs, siteScope), [logs, siteScope])
  const plot = useMemo(() => buildSarTimelinePlot(logs, siteScope), [logs, siteScope])

  const timelineEvents = useMemo(
    () => (activeSar ? buildSarTimelineEvents(logs, activeSar, siteScope) : []),
    [logs, activeSar, siteScope]
  )

  const redirectCount = useMemo(
    () => plot?.points.filter((point) => point.isRedirect).length ?? 0,
    [plot]
  )

  const applySar = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setActiveSar(sarInput.trim())
  }

  return (
    <div className="tma-analytics-panel">
      <section className="tma-analytics-card tma-dashboard-sar-lookup">
        <h2>Live sessions</h2>
        <p className="tma-dashboard-sar-lookup-hint">
          <strong>Y-axis:</strong> each SAR number. <strong>X-axis:</strong> time — past on the left,
          <strong> now</strong> in the centre, future on the right. Dots are tracked{" "}
          <strong>{sarTimelineDomainLabel(siteScope)}</strong> events: dot colour shows scan recency (red = latest);
          square = NFC scan, circle = page visit. Scroll or use the
          hour buttons to move along the timeline. Click a SAR row to filter the event log below.
        </p>
        <form className="tma-dashboard-sar-lookup-form" onSubmit={applySar}>
          <label htmlFor="sar-lookup-input">Filter event log (optional)</label>
          <input
            id="sar-lookup-input"
            type="text"
            list="sar-known-values"
            value={sarInput}
            onChange={(event) => setSarInput(event.target.value)}
            placeholder="Paste SAR to filter log"
            autoComplete="off"
          />
          <datalist id="sar-known-values">
            {knownSars.map((sar) => (
              <option key={sar} value={sar} />
            ))}
          </datalist>
          <button type="submit">Filter log</button>
        </form>
        {knownSars.length > 0 && (
          <p className="tma-dashboard-sar-lookup-meta">
            {formatNumber(knownSars.length)} SAR{knownSars.length === 1 ? "" : "s"} in this load
          </p>
        )}
      </section>

      {!plot && (
        <div className="tma-analytics-card tma-dashboard-status-card">
          <p>No SAR-linked {sarTimelineDomainSuffix(siteScope)} activity in this dashboard load yet.</p>
        </div>
      )}

      {plot && (
        <>
          <div className="tma-analytics-stats tma-analytics-stats--3">
            <AnalyticsStatCard
              label="SAR users"
              value={formatNumber(plot.sars.length)}
              meta="rows on timeline"
              icon={
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0H5z"
                    fill="currentColor"
                  />
                </svg>
              }
            />
            <AnalyticsStatCard
              label="NFC Scans"
              value={formatNumber(redirectCount)}
              meta={`REDIRECTED on ${sarTimelineDomainSuffix(siteScope)}`}
              icon={
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 4h6v16H4V4zm10 8h6v8h-6v-8z" fill="currentColor" />
                </svg>
              }
            />
            <AnalyticsStatCard
              label="All events"
              value={formatNumber(plot.points.length)}
              meta="scans + page visits"
              icon={
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M4 7h16v3H4V7zm0 5h10v3H4v-3zm0 5h7v3H4v-3z"
                    fill="currentColor"
                  />
                </svg>
              }
            />
          </div>

          <section className="tma-analytics-card tma-analytics-chart-card tma-sar-timeline-card">
            <div className="tma-analytics-card-header">
              <h2>Session timeline</h2>
            </div>
            <div className="tma-sar-timeline-chart-scroll">
              <SarTimelineChart
                logs={logs}
                highlightSar={activeSar}
                onSelectSar={(sar) => {
                  setActiveSar(sar)
                  setSarInput(sar)
                }}
              />
            </div>
          </section>

          {activeSar && (
            <section className="tma-analytics-card">
              <div className="tma-analytics-card-header">
                <h2>
                  Event log — <span className="tma-dashboard-sar-inline">{activeSar}</span>
                </h2>
                <button
                  type="button"
                  className="tma-analytics-period-btn"
                  onClick={() => {
                    setActiveSar("")
                    setSarInput("")
                  }}
                >
                  Clear filter
                </button>
              </div>
              {timelineEvents.length === 0 ? (
                <p className="tma-analytics-empty">
                  No tracked {sarTimelineDomainSuffix(siteScope)} activity for this SAR in the current load.
                </p>
              ) : (
                <div className="tma-dashboard-table-wrap tma-dashboard-table-wrap--inset">
                  <table className="tma-dashboard-table tma-dashboard-table--activity-modern">
                    <thead>
                      <tr>
                        <th>Artwork</th>
                        <th>Time</th>
                        <th>Type</th>
                        <th>Link</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timelineEvents.map((event) => (
                        <tr key={event.logId}>
                          <td data-label="Artwork">{event.artworkTitle}</td>
                          <td data-label="Time">
                            <TimestampCell value={event.timestamp} />
                          </td>
                          <td data-label="Type">
                            <span
                              className={`tma-dashboard-type-badge ${messageTypeClass(event.messageType)}`}
                            >
                              {event.messageType}
                            </span>
                          </td>
                          <td data-label="Link" className="tma-dashboard-link-cell">
                            {event.link}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  )
}
