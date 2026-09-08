import { useMemo, useState, type KeyboardEvent } from "react"
import AnalyticsTooltip from "./AnalyticsTooltip"
import AudienceBreakdownCard from "./AudienceBreakdownCard"
import AudienceBreakdownList from "./AudienceBreakdownList"
import ChartCountReadout from "./ChartCountReadout"
import { useDashboardCopy, useDashboardLocale, useSiteAnalyticsScope } from "../hooks/useSiteAnalyticsScope"
import type { BrowserKind, DeviceKind, PoiseLog } from "@tma/dashboard-scope"
import { buildAudienceAnalytics } from "@tma/dashboard-scope"
import { useTapChartInteraction } from "../hooks/useTapChartInteraction"
import { getBarHeight } from "../utils/chartBarHeight"

type DashboardAudiencePanelProps = {
  logs: PoiseLog[]
}

type ChartSelection = {
  key: string
  label: string
  count: number
  percent?: number
}

const DEVICE_COLORS: Record<DeviceKind, string> = {
  mobile: "#0a479d",
  desktop: "#0e57b8",
  tablet: "#3d7bc4",
}

const BROWSER_COLORS: Record<BrowserKind, string> = {
  Chrome: "#0a479d",
  Safari: "#0e57b8",
  Firefox: "#3d7bc4",
  Edge: "#062c61",
  Other: "#94a3b8",
}

function deviceLabels(copy: ReturnType<typeof useDashboardCopy>): Record<DeviceKind, string> {
  return {
    mobile: copy.mobile,
    desktop: copy.desktop,
    tablet: copy.tablet,
  }
}

const OS_COLORS: Record<string, string> = {
  iOS: "#0a479d",
  Android: "#0e57b8",
  Windows: "#3d7bc4",
  macOS: "#062c61",
  "Chrome OS": "#5a8fc4",
  Linux: "#7aa3d4",
  "Windows Phone": "#94a3b8",
  Other: "#94a3b8",
}

const BREAKDOWN_PALETTE = [
  "#0a479d",
  "#0e57b8",
  "#3d7bc4",
  "#062c61",
  "#5a8fc4",
  "#7aa3d4",
  "#94a3b8",
]

const LANGUAGE_COLORS: Record<string, string> = {
  English: "#0a479d",
  French: "#0e57b8",
  Spanish: "#3d7bc4",
}

function formatHourLabel(hour: number, locale: string) {
  const date = new Date()
  date.setHours(hour, 0, 0, 0)
  return date
    .toLocaleTimeString(locale, { hour: "numeric", hour12: locale !== "pt-BR" })
    .replace(":00", "")
    .replace(" ", "")
}

function formatHourTooltip(hour: number, locale: string) {
  const date = new Date()
  date.setHours(hour, 0, 0, 0)
  return date.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: locale !== "pt-BR",
  })
}

function breakdownKey(prefix: string, label: string) {
  return `${prefix}-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
}

function paletteColor(keys: string[], key: string, fallback = "#94a3b8") {
  const index = keys.indexOf(key)
  return index >= 0 ? BREAKDOWN_PALETTE[index % BREAKDOWN_PALETTE.length] : fallback
}

export default function DashboardAudiencePanel({ logs }: DashboardAudiencePanelProps) {
  const siteScope = useSiteAnalyticsScope()
  const copy = useDashboardCopy()
  const intlLocale = useDashboardLocale() === "pt-BR" ? "pt-BR" : "en-GB"
  const labels = deviceLabels(copy)
  const analytics = useMemo(() => buildAudienceAnalytics(logs, siteScope), [logs, siteScope])
  const hourlyMax = Math.max(...analytics.hourly.map((item) => item.count), 1)
  const dailyMax = Math.max(...analytics.daily.map((item) => item.count), 1)
  const tapToSelect = useTapChartInteraction()
  const [hourlySelection, setHourlySelection] = useState<ChartSelection | null>(null)
  const [dailySelection, setDailySelection] = useState<ChartSelection | null>(null)
  const [browserSelection, setBrowserSelection] = useState<ChartSelection | null>(null)
  const [deviceInfoSelection, setDeviceInfoSelection] = useState<ChartSelection | null>(null)
  const [languageSelection, setLanguageSelection] = useState<ChartSelection | null>(null)

  const browserItems = useMemo(
    () =>
      analytics.browsers.map((item) => ({
        key: `browser-${item.kind}`,
        label: item.kind,
        count: item.count,
        percent: item.percent,
      })),
    [analytics.browsers]
  )

  const deviceInfoItems = useMemo(
    () =>
      analytics.deviceInfo.map((item) => ({
        key: breakdownKey("os", item.label),
        label: item.label,
        count: item.count,
        percent: item.percent,
      })),
    [analytics.deviceInfo]
  )

  const languageItems = useMemo(
    () =>
      analytics.languages.map((item) => ({
        key: breakdownKey("lang", item.label),
        label: item.label,
        count: item.count,
        percent: item.percent,
      })),
    [analytics.languages]
  )

  const languageKeys = useMemo(() => languageItems.map((item) => item.key), [languageItems])

  const donutStyle = useMemo(() => {
    let cursor = 0
    const segments = analytics.devices
      .filter((item) => item.count > 0)
      .map((item) => {
        const start = cursor
        cursor += item.percent
        return `${DEVICE_COLORS[item.kind]} ${start}% ${cursor}%`
      })

    if (segments.length === 0) {
      return { background: "#e8edf7" }
    }

    return { background: `conic-gradient(${segments.join(", ")})` }
  }, [analytics.devices])

  const toggleSelection = (
    current: ChartSelection | null,
    next: ChartSelection,
    setter: (value: ChartSelection | null) => void
  ) => {
    setter(current?.key === next.key ? null : next)
  }

  const handleChartKeyDown = (event: KeyboardEvent, onActivate: () => void) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onActivate()
    }
  }

  const renderHourColumn = (item: (typeof analytics.hourly)[number]) => {
    const { height, isZero } = getBarHeight(item.count, hourlyMax)
    const label = formatHourTooltip(item.hour, intlLocale)
    const key = `hour-${item.hour}`
    const isSelected = hourlySelection?.key === key

    return (
      <div
        key={item.hour}
        className={`tma-analytics-hour-col${isSelected ? " tma-analytics-bar-col--hovered" : ""}${tapToSelect ? " tma-analytics-bar-col--tappable" : ""}`}
        role={tapToSelect ? "button" : undefined}
        tabIndex={tapToSelect ? 0 : undefined}
        aria-pressed={tapToSelect ? isSelected : undefined}
        onClick={
          tapToSelect
            ? () =>
                toggleSelection(
                  hourlySelection,
                  { key, label, count: item.count },
                  setHourlySelection
                )
            : undefined
        }
        onMouseEnter={
          tapToSelect ? undefined : () => setHourlySelection({ key, label, count: item.count })
        }
        onMouseLeave={tapToSelect ? undefined : () => setHourlySelection(null)}
        aria-label={tapToSelect ? `${label}, ${copy.taps(item.count)}` : undefined}
        onKeyDown={
          tapToSelect
            ? (event) =>
                handleChartKeyDown(event, () =>
                  toggleSelection(
                    hourlySelection,
                    { key, label, count: item.count },
                    setHourlySelection
                  )
                )
            : undefined
        }
      >
        <div
          className={`tma-analytics-hour-bar${isZero ? " tma-analytics-hour-bar--zero" : ""}${isSelected ? " tma-analytics-bar--hovered" : ""}`}
          style={{
            height,
            opacity: isZero ? 0.35 : 0.35 + item.intensity * 0.65,
          }}
        />
        <span>{formatHourLabel(item.hour, intlLocale)}</span>
      </div>
    )
  }

  const hourlyAm = analytics.hourly.slice(0, 12)
  const hourlyPm = analytics.hourly.slice(12, 24)

  return (
    <div className="tma-analytics-panel">
      <div className="tma-analytics-audience-grid">
        <section className="tma-analytics-card tma-analytics-devices-card">
          <h2>{copy.devices}</h2>
          {analytics.hasDeviceData ? (
            <>
              <div className="tma-analytics-devices">
                <div className="tma-analytics-donut" style={donutStyle} aria-hidden="true">
                  <div className="tma-analytics-donut-hole" />
                </div>
                <ul className="tma-analytics-legend">
                  {analytics.devices.map((item) => (
                    <li key={item.kind}>
                      <AnalyticsTooltip
                        label={labels[item.kind]}
                        value={copy.visitsDotPercent(copy.visits(item.count), item.percent)}
                      >
                        <span
                          className="tma-analytics-legend-dot"
                          style={{ backgroundColor: DEVICE_COLORS[item.kind] }}
                        />
                        <span>{labels[item.kind]}</span>
                        <strong>{item.percent}%</strong>
                      </AnalyticsTooltip>
                    </li>
                  ))}
                </ul>
              </div>

              {analytics.hasDeviceInfoData && (
                <div className="tma-analytics-devices-os">
                  <h3 className="tma-analytics-subheading">{copy.operatingSystem}</h3>
                  <AudienceBreakdownList
                    items={deviceInfoItems}
                    colorForKey={(key) => {
                      const label =
                        deviceInfoItems.find((item) => item.key === key)?.label ?? "Other"
                      return OS_COLORS[label] ?? "#94a3b8"
                    }}
                    selection={deviceInfoSelection}
                    onSelectionChange={setDeviceInfoSelection}
                    tapToSelect={tapToSelect}
                    readoutIdleTap={copy.tapOs}
                    readoutIdleHover={copy.hoverOs}
                    onKeyDown={handleChartKeyDown}
                    className="tma-analytics-devices-os-list"
                  />
                </div>
              )}
            </>
          ) : (
            <p className="tma-analytics-empty">{copy.noDeviceData}</p>
          )}
        </section>

        <AudienceBreakdownCard
          title={copy.browsers}
          items={browserItems}
          hasData={analytics.hasDeviceData}
          emptyMessage={copy.noBrowserData}
          colorForKey={(key) => BROWSER_COLORS[key.replace("browser-", "") as BrowserKind] ?? "#94a3b8"}
          selection={browserSelection}
          onSelectionChange={setBrowserSelection}
          tapToSelect={tapToSelect}
          readoutIdleTap={copy.tapBrowser}
          readoutIdleHover={copy.hoverBrowser}
          onKeyDown={handleChartKeyDown}
        />

        <AudienceBreakdownCard
          title={copy.language}
          className="tma-analytics-language-card"
          listClassName="tma-analytics-language-list"
          items={languageItems}
          hasData={analytics.hasLanguageData}
          emptyMessage={copy.noLanguageData}
          colorForKey={(key) => {
            const label = languageItems.find((item) => item.key === key)?.label ?? ""
            return LANGUAGE_COLORS[label] ?? paletteColor(languageKeys, key)
          }}
          selection={languageSelection}
          onSelectionChange={setLanguageSelection}
          tapToSelect={tapToSelect}
          readoutIdleTap={copy.tapLanguage}
          readoutIdleHover={copy.hoverLanguage}
          onKeyDown={handleChartKeyDown}
        />
      </div>

      <section className="tma-analytics-card">
        <h2>{copy.hourlyActivity}</h2>
        <ChartCountReadout
          label={hourlySelection?.label ?? null}
          value={hourlySelection ? copy.taps(hourlySelection.count) : null}
          tapToSelect={tapToSelect}
          idleMessage={
            tapToSelect ? copy.tapBar : copy.hoverBar
          }
        />
        <div className="tma-analytics-hourly-chart-rows">
          <div
            className="tma-analytics-hourly-chart"
            aria-label={copy.hourlyAm}
          >
            {hourlyAm.map(renderHourColumn)}
          </div>
          <div
            className="tma-analytics-hourly-chart"
            aria-label={copy.hourlyPm}
          >
            {hourlyPm.map(renderHourColumn)}
          </div>
        </div>
      </section>

      <section className="tma-analytics-card">
        <h2>{copy.dailyActivity}</h2>
        <ChartCountReadout
          label={dailySelection?.label ?? null}
          value={dailySelection ? copy.taps(dailySelection.count) : null}
          tapToSelect={tapToSelect}
          idleMessage={
            tapToSelect ? copy.tapBar : copy.hoverBar
          }
        />
        <div className="tma-analytics-daily-chart" aria-label={copy.dailyActivity}>
          {analytics.daily.map((item) => {
            const { height, isZero } = getBarHeight(item.count, dailyMax)
            const key = `day-${item.weekday}`
            const isSelected = dailySelection?.key === key
            const bar = (
              <div
                className={`tma-analytics-hour-bar${isZero ? " tma-analytics-hour-bar--zero" : ""}${isSelected ? " tma-analytics-bar--hovered" : ""}`}
                style={{
                  height,
                  opacity: isZero ? 0.35 : 0.35 + item.intensity * 0.65,
                }}
              />
            )

            return (
              <div
                key={item.weekday}
                className={`tma-analytics-hour-col${isSelected ? " tma-analytics-bar-col--hovered" : ""}${tapToSelect ? " tma-analytics-bar-col--tappable" : ""}`}
                role={tapToSelect ? "button" : undefined}
                tabIndex={tapToSelect ? 0 : undefined}
                aria-pressed={tapToSelect ? isSelected : undefined}
                onClick={
                  tapToSelect
                    ? () =>
                        toggleSelection(
                          dailySelection,
                          { key, label: item.label, count: item.count },
                          setDailySelection
                        )
                    : undefined
                }
                onMouseEnter={
                  tapToSelect
                    ? undefined
                    : () => setDailySelection({ key, label: item.label, count: item.count })
                }
                onMouseLeave={tapToSelect ? undefined : () => setDailySelection(null)}
                aria-label={
                  tapToSelect ? `${item.label}, ${copy.taps(item.count)}` : undefined
                }
                onKeyDown={
                  tapToSelect
                    ? (event) =>
                        handleChartKeyDown(event, () =>
                          toggleSelection(
                            dailySelection,
                            { key, label: item.label, count: item.count },
                            setDailySelection
                          )
                        )
                    : undefined
                }
              >
                {bar}
                <span>{item.label}</span>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
