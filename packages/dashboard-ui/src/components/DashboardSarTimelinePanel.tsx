import { type FormEvent, useMemo, useState } from "react"
import AnalyticsStatCard from "./AnalyticsStatCard"
import DashboardActivityTableRow from "./DashboardActivityTableRow"
import SarTimelineChart from "./SarTimelineChart"
import { useDashboardCopy, useSiteAnalyticsScope } from "../hooks/useSiteAnalyticsScope"
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

export default function DashboardSarTimelinePanel({ logs }: DashboardSarTimelinePanelProps) {
  const siteScope = useSiteAnalyticsScope()
  const copy = useDashboardCopy()
  const [sarInput, setSarInput] = useState("")
  const [activeSar, setActiveSar] = useState("")

  const knownSars = useMemo(() => listDistinctSars(logs, siteScope), [logs, siteScope])
  const plot = useMemo(() => buildSarTimelinePlot(logs, siteScope), [logs, siteScope])

  const timelineEntries = useMemo(
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
        <h2>{copy.liveSessions}</h2>
        <p className="tma-dashboard-sar-lookup-hint">
          {copy.liveSessionsHint(sarTimelineDomainLabel(siteScope))}
        </p>
        <form className="tma-dashboard-sar-lookup-form" onSubmit={applySar}>
          <label htmlFor="sar-lookup-input">{copy.filterEventLog}</label>
          <input
            id="sar-lookup-input"
            type="text"
            list="sar-known-values"
            value={sarInput}
            onChange={(event) => setSarInput(event.target.value)}
            placeholder={copy.pasteSar}
            autoComplete="off"
          />
          <datalist id="sar-known-values">
            {knownSars.map((sar) => (
              <option key={sar} value={sar} />
            ))}
          </datalist>
          <button type="submit">{copy.filterLog}</button>
        </form>
        {knownSars.length > 0 && (
          <p className="tma-dashboard-sar-lookup-meta">
            {copy.sarsInLoad(knownSars.length)}
          </p>
        )}
      </section>

      {!plot && (
        <div className="tma-analytics-card tma-dashboard-status-card">
          <p>{copy.noSarActivity(sarTimelineDomainSuffix(siteScope))}</p>
        </div>
      )}

      {plot && (
        <>
          <div className="tma-analytics-stats tma-analytics-stats--3">
            <AnalyticsStatCard
              label={copy.sarUsers}
              value={formatNumber(plot.sars.length)}
              meta={copy.rowsOnTimeline}
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
              label={copy.nfcScans}
              value={formatNumber(redirectCount)}
              meta={copy.redirectedOn(sarTimelineDomainSuffix(siteScope))}
              icon={
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 4h6v16H4V4zm10 8h6v8h-6v-8z" fill="currentColor" />
                </svg>
              }
            />
            <AnalyticsStatCard
              label={copy.allEvents}
              value={formatNumber(plot.points.length)}
              meta={copy.scansAndVisits}
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
              <h2>{copy.sessionTimeline}</h2>
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
                  {copy.eventLog} <span className="tma-dashboard-sar-inline">{activeSar}</span>
                </h2>
                <button
                  type="button"
                  className="tma-analytics-period-btn"
                  onClick={() => {
                    setActiveSar("")
                    setSarInput("")
                  }}
                >
                  {copy.clearFilter}
                </button>
              </div>
              {timelineEntries.length === 0 ? (
                <p className="tma-analytics-empty">
                  {copy.noSarActivityForFilter(sarTimelineDomainSuffix(siteScope))}
                </p>
              ) : (
                <div className="tma-dashboard-table-wrap tma-dashboard-table-wrap--inset">
                  <table className="tma-dashboard-table tma-dashboard-table--activity-modern">
                    <thead>
                      <tr>
                        <th>{copy.artwork}</th>
                        <th>{copy.time}</th>
                        <th>{copy.type}</th>
                        <th>{copy.seen}</th>
                        <th>{copy.link}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timelineEntries.map((entry) => (
                        <DashboardActivityTableRow
                          key={entry.key}
                          entry={entry}
                          logs={logs}
                          scope={siteScope}
                          showLogId={false}
                        />
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
