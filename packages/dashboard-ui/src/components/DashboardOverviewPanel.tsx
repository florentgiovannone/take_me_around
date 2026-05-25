import { useMemo, useState } from "react"
import AnalyticsStatCard, { StatIcon } from "./AnalyticsStatCard"
import ChartCountReadout from "./ChartCountReadout"
import { useSiteAnalyticsScope } from "../hooks/useSiteAnalyticsScope"
import type { CalendarDayCell, MonthlyCalendarWindow, PoiseLog, TimeSeriesPoint } from "@tma/dashboard-scope"
import {
  buildMonthlyCalendarGrid,
  buildOverviewAnalytics,
  buildWeekTotalsFromSeries,
  buildWeeklySeries,
  formatNumber,
  formatSignedPercent,
} from "@tma/dashboard-scope"
import { useMediaQuery } from "../hooks/useMediaQuery"
import { useTapChartInteraction } from "../hooks/useTapChartInteraction"
import { getBarHeight } from "../utils/chartBarHeight"

type DashboardOverviewPanelProps = {
  logs: PoiseLog[]
}

const CALENDAR_WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const

function formatPointValue(point: TimeSeriesPoint) {
  if (point.isFuture) return "Upcoming"
  return `${formatNumber(point.count)} tap${point.count === 1 ? "" : "s"}`
}

type DayBarColumnProps = {
  point: TimeSeriesPoint
  dayIndex: number
  seriesLength: number
  maxCount: number
  selectedPoint: TimeSeriesPoint | null
  tapToSelect: boolean
  onSelect: (point: TimeSeriesPoint | null) => void
}

function DayBarColumn({
  point,
  dayIndex,
  seriesLength,
  maxCount,
  selectedPoint,
  tapToSelect,
  onSelect,
}: DayBarColumnProps) {
  const { height, isZero } = getBarHeight(point.count, maxCount)
  const shade = 18 + (dayIndex / Math.max(seriesLength - 1, 1)) * 62
  const isSelected = selectedPoint?.key === point.key

  const handleClick = () => {
    if (!tapToSelect || point.isFuture) return
    onSelect(isSelected ? null : point)
  }

  return (
    <div
      className={`tma-analytics-bar-col${point.isFuture ? " tma-analytics-bar-col--future" : ""}${isSelected ? " tma-analytics-bar-col--hovered" : ""
        }${tapToSelect && !point.isFuture ? " tma-analytics-bar-col--tappable" : ""}`}
      role={tapToSelect && !point.isFuture ? "button" : undefined}
      tabIndex={tapToSelect && !point.isFuture ? 0 : undefined}
      aria-pressed={tapToSelect && !point.isFuture ? isSelected : undefined}
      aria-label={
        tapToSelect && !point.isFuture ? `${point.label}, ${formatPointValue(point)}` : undefined
      }
      onMouseEnter={tapToSelect ? undefined : () => onSelect(point)}
      onMouseLeave={tapToSelect ? undefined : () => onSelect(null)}
      onClick={handleClick}
      onKeyDown={
        tapToSelect && !point.isFuture
          ? (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault()
              handleClick()
            }
          }
          : undefined
      }
    >
      <div
        className={`tma-analytics-bar${isZero ? " tma-analytics-bar--zero" : ""}${point.isFuture ? " tma-analytics-bar--future" : ""
          }${isSelected ? " tma-analytics-bar--hovered" : ""}`}
        style={{
          height,
          background: `linear-gradient(180deg, hsl(210 ${shade}% 52%) 0%, hsl(210 ${shade + 6}% 36%) 100%)`,
        }}
      />
    </div>
  )
}

export default function DashboardOverviewPanel({ logs }: DashboardOverviewPanelProps) {
  const siteScope = useSiteAnalyticsScope()
  const [timeRange, setTimeRange] = useState<"daily" | "monthly">("daily")
  const [periodOffset, setPeriodOffset] = useState(0)
  const [selectedPoint, setSelectedPoint] = useState<TimeSeriesPoint | null>(null)
  const tapToSelect = useTapChartInteraction()
  const analytics = useMemo(() => buildOverviewAnalytics(logs, siteScope), [logs, siteScope])

  const chartWindow = useMemo(() => {
    if (timeRange === "daily") {
      return buildWeeklySeries(logs, periodOffset, siteScope)
    }
    return buildMonthlyCalendarGrid(logs, periodOffset, siteScope)
  }, [logs, timeRange, periodOffset, siteScope])

  const isMonthly = timeRange === "monthly"
  const { series, periodLabel, canGoForward } = chartWindow
  const calendarWeeks = isMonthly ? (chartWindow as MonthlyCalendarWindow).weeks : []
  const maxCount = Math.max(...series.map((point) => point.count), 1)
  const isDesktopCalendar = useMediaQuery("(min-width: 1025px)")
  const calendarWeekRowHeight = Math.max(
    isDesktopCalendar ? 128 : 72,
    Math.floor((isDesktopCalendar ? 720 : 360) / Math.max(calendarWeeks.length, 1))
  )
  const weekTotals = useMemo(() => buildWeekTotalsFromSeries(series), [series])
  const monthTotal = useMemo(
    () => series.filter((point) => !point.isFuture).reduce((sum, point) => sum + point.count, 0),
    [series]
  )

  const handleTimeRangeChange = (range: "daily" | "monthly") => {
    setTimeRange(range)
    setPeriodOffset(0)
    setSelectedPoint(null)
  }

  const renderCalendarCell = (cell: CalendarDayCell, cellKey: string) => {
    if (cell.kind === "padding") {
      return (
        <div
          key={cellKey}
          className="tma-analytics-calendar-day tma-analytics-calendar-day--padding"
          aria-hidden="true"
        />
      )
    }

    return (
      <div key={cellKey} className="tma-analytics-calendar-day">
        <span className="tma-analytics-calendar-day-label">{cell.dayOfMonth}</span>
        <div className="tma-analytics-calendar-day-bars">
          <DayBarColumn
            point={cell}
            dayIndex={cell.dayIndex}
            seriesLength={series.length}
            maxCount={maxCount}
            selectedPoint={selectedPoint}
            tapToSelect={tapToSelect}
            onSelect={setSelectedPoint}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="tma-analytics-panel">
      <div className="tma-analytics-stats">
        <article className="tma-analytics-stat-card">
          <StatIcon>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 4h6v16H4V4zm10 8h6v8h-6v-8z" fill="currentColor" />
            </svg>
          </StatIcon>
          <p className="tma-analytics-stat-label">Total Taps</p>
          <p className="tma-analytics-stat-value">{formatNumber(analytics.totalTaps)}</p>
          <p
            className={`tma-analytics-stat-meta ${analytics.weeklyChange >= 0 ? "is-positive" : "is-negative"
              }`}
          >
            {formatSignedPercent(analytics.weeklyChange)} this week
          </p>
        </article>

        <article className="tma-analytics-stat-card">
          <StatIcon>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M4 7h16v3H4V7zm0 5h10v3H4v-3zm0 5h7v3H4v-3z"
                fill="currentColor"
              />
            </svg>
          </StatIcon>
          <p className="tma-analytics-stat-label">Active Tags</p>
          <p className="tma-analytics-stat-value">{formatNumber(analytics.activeTags)}</p>
          <p className="tma-analytics-stat-meta">{analytics.activeTags} links tracked</p>
        </article>

        <article className="tma-analytics-stat-card">
          <StatIcon>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.8 7.2 18l.9-5.4L4.2 8.7l5.4-.8L12 3z"
                fill="currentColor"
              />
            </svg>
          </StatIcon>
          <p className="tma-analytics-stat-label">Top Tag</p>
          <p className="tma-analytics-stat-value tma-analytics-stat-value--text">
            {analytics.topTagName}
          </p>
          <p className="tma-analytics-stat-meta is-accent">
            {formatNumber(analytics.topTagMonthCount)} taps this month
          </p>
        </article>

        <article className="tma-analytics-stat-card">
          <StatIcon>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M6 5h12v2H6V5zm0 6h12v2H6v-2zm0 6h12v2H6v-2z"
                fill="currentColor"
              />
            </svg>
          </StatIcon>
          <p className="tma-analytics-stat-label">Avg / Tag</p>
          <p className="tma-analytics-stat-value">{formatNumber(analytics.avgPerTag)}</p>
          <p className="tma-analytics-stat-meta">taps per link</p>
        </article>
      </div>

      <section className="tma-analytics-card tma-analytics-chart-card">
        <div className="tma-analytics-card-header">
          <h2>Taps Over Time</h2>
          <div className="tma-analytics-toggle" role="tablist" aria-label="Time range">
            <button
              type="button"
              role="tab"
              aria-selected={timeRange === "daily"}
              className={timeRange === "daily" ? "is-active" : ""}
              onClick={() => handleTimeRangeChange("daily")}
            >
              Weekly
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={timeRange === "monthly"}
              className={timeRange === "monthly" ? "is-active" : ""}
              onClick={() => handleTimeRangeChange("monthly")}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="tma-analytics-period-nav">
          <button
            type="button"
            className="tma-analytics-period-btn"
            aria-label={timeRange === "daily" ? "Previous week" : "Previous month"}
            onClick={() => {
              setPeriodOffset((current) => current + 1)
              setSelectedPoint(null)
            }}
          >
            ←
          </button>
          <span className="tma-analytics-period-label">{periodLabel}</span>
          <button
            type="button"
            className="tma-analytics-period-btn"
            aria-label={timeRange === "daily" ? "Next week" : "Next month"}
            disabled={!canGoForward}
            onClick={() => {
              setPeriodOffset((current) => Math.max(0, current - 1))
              setSelectedPoint(null)
            }}
          >
            →
          </button>
        </div>

        <ChartCountReadout
          label={selectedPoint?.label ?? null}
          value={selectedPoint ? formatPointValue(selectedPoint) : null}
          tapToSelect={tapToSelect}
          idleMessage={
            tapToSelect ? "Tap a day to see tap counts" : "Hover a day to see tap counts"
          }
        />

        <div className="tma-analytics-bar-chart-scroll">
          {isMonthly ? (
            <div className="tma-analytics-calendar" aria-label="Taps over time calendar">
              <div className="tma-analytics-calendar-weekdays" aria-hidden="true">
                {CALENDAR_WEEKDAYS.map((weekday) => (
                  <span key={weekday} className="tma-analytics-calendar-weekday">
                    {weekday}
                  </span>
                ))}
              </div>
              {calendarWeeks.map((week, weekIndex) => (
                <div
                  key={weekIndex}
                  className="tma-analytics-calendar-week tma-analytics-bar-chart tma-analytics-bar-chart--interactive tma-analytics-bar-chart--monthly"
                  style={{ height: calendarWeekRowHeight }}
                >
                  {week.map((cell, cellIndex) =>
                    renderCalendarCell(cell, `${weekIndex}-${cellIndex}`)
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div
              className="tma-analytics-bar-chart tma-analytics-bar-chart--interactive"
              aria-label="Taps over time"
              style={{ gridTemplateColumns: `repeat(${series.length}, minmax(0, 1fr))` }}
            >
              {series.map((point, index) => (
                <DayBarColumn
                  key={point.key}
                  point={point}
                  dayIndex={index}
                  seriesLength={series.length}
                  maxCount={maxCount}
                  selectedPoint={selectedPoint}
                  tapToSelect={tapToSelect}
                  onSelect={setSelectedPoint}
                />
              ))}
            </div>
          )}
        </div>

        <div className="tma-analytics-week-totals">
          <h3 className="tma-analytics-week-totals-title">
            {isMonthly ? "Total taps per month" : "Total taps per week"}
          </h3>
          <ul className="tma-analytics-week-totals-list">
            {isMonthly ? (
              monthTotal === 0 ? (
                <li className="tma-analytics-week-totals-empty">No taps in this period.</li>
              ) : (
                <li className="tma-analytics-week-totals-item">
                  <span>{periodLabel}</span>
                  <strong>
                    {formatNumber(monthTotal)} tap{monthTotal === 1 ? "" : "s"}
                  </strong>
                </li>
              )
            ) : (
              <>
                {weekTotals.length === 0 && (
                  <li className="tma-analytics-week-totals-empty">No taps in this period.</li>
                )}
                {weekTotals.map((week) => (
                  <li key={week.key} className="tma-analytics-week-totals-item">
                    <span>{periodLabel}</span>
                    <strong>
                      {formatNumber(week.count)} tap{week.count === 1 ? "" : "s"}
                    </strong>
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>
      </section>
    </div>
  )
}
