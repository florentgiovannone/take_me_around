import { useCallback, useEffect, useMemo, useRef, useState, startTransition } from "react"
import { useSiteAnalyticsScope } from "../hooks/useSiteAnalyticsScope"
import {
  buildSarTimelineGridTicks,
  buildSarTimelinePlot,
  buildSarTimelineRowMetaMap,
  formatSarTimelineRowMetaSubtitle,
  formatSarTimelineViewRange,
  sarTimelineCanvasWidthPx,
  sarTimelineHourScrollPx,
  sarTimelineNowPx,
  sarTimelinePointPx,
  sarTimelineViewportRange,
  sarTimelineOffsetBoundsForScroll,
  SAR_TIMELINE_ZOOM_MAX_HALF_MS,
  SAR_TIMELINE_ZOOM_MIN_HALF_MS,
  formatSarTimelineZoomSpan,
  sarTimelineFitAllHalfMs,
  sarTimelineIsFullWindow,
  sarTimelineZoomLevelsForPlot,
  sarTimelineZoomIndexForHalf,
  sarTimelineMsPerPx,
  sarTimelineMapExtentMs,
  type PoiseLog,
  type SarTimelinePlotPoint,
} from "@tma/dashboard-scope"
import { formatLogTimestamp } from "../utils/dashboardFormatters"

const ROW_HEIGHT_PX = 44
const TICKS_HEIGHT_PX = 52
const FRESH_SCAN_STARS_MS = 5000
const ORBIT_STAR_COUNT = 6
function SarOrbitStars() {
  return (
    <span className="tma-sar-timeline-stars" aria-hidden="true">
      {Array.from({ length: ORBIT_STAR_COUNT }, (_, index) => (
        <span
          key={index}
          className="tma-sar-timeline-star"
          style={{ ["--star-i" as string]: String(index) }}
        />
      ))}
    </span>
  )
}

type SarTimelineChartProps = {
  logs: PoiseLog[]
  highlightSar?: string
  onSelectSar?: (sar: string) => void
}

function truncateSarLabel(sar: string) {
  if (sar.length <= 16) return sar
  return `${sar.slice(0, 7)}…${sar.slice(-5)}`
}

function formatOffsetLabel(offsetMs: number) {
  const abs = Math.abs(offsetMs)
  const minutes = Math.round(abs / 60000)
  if (minutes < 60) return `${offsetMs < 0 ? "−" : "+"}${minutes}m`
  const hours = Math.round(minutes / 60)
  return `${offsetMs < 0 ? "−" : "+"}${hours}h`
}

type ScanRecencyRank = 1 | 2 | 3

function buildRecencyRankByLogId(
  points: SarTimelinePlotPoint[]
): Map<number, ScanRecencyRank> {
  const bySar = new Map<string, SarTimelinePlotPoint[]>()
  for (const point of points) {
    const list = bySar.get(point.sar) ?? []
    list.push(point)
    bySar.set(point.sar, list)
  }

  const ranks = new Map<number, ScanRecencyRank>()
  for (const sarPoints of bySar.values()) {
    sarPoints.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    for (let index = 0; index < Math.min(3, sarPoints.length); index += 1) {
      ranks.set(sarPoints[index].logId, (index + 1) as ScanRecencyRank)
    }
  }
  return ranks
}

function recencyClassForRank(rank: ScanRecencyRank | undefined) {
  if (rank === 1) return " is-latest-scan"
  if (rank === 2) return " is-recent-scan-2"
  if (rank === 3) return " is-recent-scan-3"
  return " is-older-scan"
}

type RecencyLegendTarget = ScanRecencyRank | "older"

function viewportCentreOffsetMs(
  scrollLeftPx: number,
  viewportWidthPx: number,
  totalExtentMs: number,
  viewportHalfExtentMs: number
) {
  const centrePx = scrollLeftPx + viewportWidthPx / 2
  return (
    centrePx * sarTimelineMsPerPx(viewportHalfExtentMs, viewportWidthPx) -
    totalExtentMs
  )
}

function findPointForSelectedSarRecency(
  points: SarTimelinePlotPoint[],
  sar: string,
  target: RecencyLegendTarget
): SarTimelinePlotPoint | null {
  const sarPoints = points
    .filter((point) => point.sar.toLowerCase() === sar.toLowerCase())
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  if (sarPoints.length === 0) return null
  if (target === 1) return sarPoints[0] ?? null
  if (target === 2) return sarPoints[1] ?? null
  if (target === 3) return sarPoints[2] ?? null
  return sarPoints[3] ?? sarPoints[sarPoints.length - 1] ?? null
}

export default function SarTimelineChart({
  logs,
  highlightSar = "",
  onSelectSar,
}: SarTimelineChartProps) {
  const siteScope = useSiteAnalyticsScope()
  const plot = useMemo(() => buildSarTimelinePlot(logs, siteScope), [logs, siteScope])
  const rowMeta = useMemo(() => buildSarTimelineRowMetaMap(logs), [logs])
  const recencyRanks = useMemo(
    () => (plot ? buildRecencyRankByLogId(plot.points) : new Map()),
    [plot]
  )
  const scrollRef = useRef<HTMLDivElement>(null)
  const prevLatestBySarRef = useRef<Map<string, number>>(new Map())
  const hasInitializedLatestRef = useRef(false)
  const [freshLatestLogIds, setFreshLatestLogIds] = useState<Set<number>>(() => new Set())
  const [zoomHalfExtentMs, setZoomHalfExtentMs] = useState(SAR_TIMELINE_ZOOM_MAX_HALF_MS)
  const pendingCentreOffsetRef = useRef<number | null>(null)
  const pendingScrollSmoothRef = useRef(false)
  const plotColumnRef = useRef<HTMLDivElement>(null)
  const hasCenteredOnMountRef = useRef(false)
  const savedCentreOffsetRef = useRef(0)
  const plotDataFingerprintRef = useRef("")
  const lastHighlightSarRef = useRef("")
  const [viewportWidth, setViewportWidth] = useState(720)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [hoveredPoint, setHoveredPoint] = useState<SarTimelinePlotPoint | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [focusedLogId, setFocusedLogId] = useState<number | null>(null)
  const scrollRafRef = useRef<number | null>(null)
  /** After legend jump, ignore hover until the pointer moves (avoids tooltip under cursor after pan). */
  const suppressHoverTooltipRef = useRef(false)

  const applyScrollLeft = useCallback((left: number, smooth = false) => {
    const el = scrollRef.current
    if (!el) return
    const next = Math.max(0, left)
    el.scrollTo({ left: next, behavior: smooth ? "smooth" : "instant" })
    setScrollLeft(next)
  }, [])

  const handleScroll = useCallback(
    (scrollLeftPx: number) => {
      if (scrollRafRef.current != null) {
        cancelAnimationFrame(scrollRafRef.current)
      }
      scrollRafRef.current = requestAnimationFrame(() => {
        scrollRafRef.current = null
        setScrollLeft(scrollLeftPx)
        if (plot && scrollRef.current) {
          const width = plotColumnRef.current?.clientWidth || viewportWidth
          savedCentreOffsetRef.current = viewportCentreOffsetMs(
            scrollLeftPx,
            width,
            plot.totalExtentMs,
            zoomHalfExtentMs
          )
        }
      })
    },
    [plot, viewportWidth, zoomHalfExtentMs]
  )

  const scrollToNow = useCallback(
    (smooth = true) => {
      if (!plot || !scrollRef.current) return
      const width = plotColumnRef.current?.clientWidth || viewportWidth
      const nowPx = sarTimelineNowPx(plot.totalExtentMs, zoomHalfExtentMs, width)
      applyScrollLeft(Math.max(0, nowPx - width / 2), smooth)
    },
    [plot, viewportWidth, zoomHalfExtentMs, applyScrollLeft]
  )

  const scrollToOffsetMs = useCallback(
    (offsetMs: number, smooth = false) => {
      if (!plot || !scrollRef.current) return
      const width = plotColumnRef.current?.clientWidth || viewportWidth
      const centrePx = sarTimelinePointPx(
        offsetMs,
        plot.totalExtentMs,
        zoomHalfExtentMs,
        width
      )
      const el = scrollRef.current
      const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth)
      const next = Math.min(maxScroll, Math.max(0, centrePx - width / 2))
      applyScrollLeft(next, smooth)
    },
    [plot, viewportWidth, zoomHalfExtentMs, applyScrollLeft]
  )

  const scrollToRecency = useCallback(
    (target: RecencyLegendTarget) => {
      const sar = highlightSar.trim()
      if (!sar || !plot || !scrollRef.current) return

      const point = findPointForSelectedSarRecency(plot.points, sar, target)
      if (!point) return

      setHoveredPoint(null)
      suppressHoverTooltipRef.current = true

      const mapExtent = sarTimelineMapExtentMs(
        plot.totalExtentMs,
        zoomHalfExtentMs
      )
      const needsFullTimeline =
        Math.abs(point.offsetMs) > mapExtent * 0.98
      const targetZoom = needsFullTimeline
        ? sarTimelineFitAllHalfMs(plot.totalExtentMs)
        : zoomHalfExtentMs

      const centreOffset = viewportCentreOffsetMs(
        scrollRef.current.scrollLeft,
        viewportWidth,
        plot.totalExtentMs,
        zoomHalfExtentMs
      )
      const alreadyCentered =
        Math.abs(point.offsetMs - centreOffset) < zoomHalfExtentMs * 0.12

      if (alreadyCentered && zoomHalfExtentMs === targetZoom) return

      pendingCentreOffsetRef.current = point.offsetMs
      pendingScrollSmoothRef.current = true

      if (zoomHalfExtentMs !== targetZoom) {
        setZoomHalfExtentMs(targetZoom)
        return
      }

      pendingCentreOffsetRef.current = null
      pendingScrollSmoothRef.current = false
      requestAnimationFrame(() => {
        requestAnimationFrame(() => scrollToOffsetMs(point.offsetMs, true))
      })
    },
    [highlightSar, plot, viewportWidth, zoomHalfExtentMs, scrollToOffsetMs]
  )

  useEffect(() => {
    const sar = highlightSar.trim()
    if (!sar) {
      lastHighlightSarRef.current = ""
      setFocusedLogId(null)
      setHoveredPoint(null)
      return
    }
    if (!plot || !scrollRef.current) return
    if (lastHighlightSarRef.current === sar) return

    lastHighlightSarRef.current = sar

    const point = findPointForSelectedSarRecency(plot.points, sar, 1)
    if (!point) return

    setFocusedLogId(point.logId)

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollToOffsetMs(point.offsetMs, false))
    })
    return () => cancelAnimationFrame(frame)
  }, [highlightSar, plot, viewportWidth, scrollToOffsetMs])

  useEffect(() => {
    if (!plot) return

    const nextLatestBySar = new Map<string, number>()
    const newlyFresh = new Set<number>()

    for (const sar of plot.sars) {
      const sarPoints = plot.points
        .filter((point) => point.sar === sar)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      const latestId = sarPoints[0]?.logId
      if (latestId == null) continue
      nextLatestBySar.set(sar, latestId)
      if (prevLatestBySarRef.current.get(sar) !== latestId) {
        newlyFresh.add(latestId)
      }
    }

    if (!hasInitializedLatestRef.current) {
      hasInitializedLatestRef.current = true
      prevLatestBySarRef.current = nextLatestBySar
      return
    }

    prevLatestBySarRef.current = nextLatestBySar

    if (newlyFresh.size === 0) return

    setFreshLatestLogIds((prev) => new Set([...prev, ...newlyFresh]))
    const timeout = window.setTimeout(() => {
      setFreshLatestLogIds((prev) => {
        const next = new Set(prev)
        for (const id of newlyFresh) next.delete(id)
        return next
      })
    }, FRESH_SCAN_STARS_MS)

    return () => window.clearTimeout(timeout)
  }, [plot])

  useEffect(() => {
    if (pendingCentreOffsetRef.current == null || !plot || !scrollRef.current) return
    const offsetMs = pendingCentreOffsetRef.current
    pendingCentreOffsetRef.current = null
    const smooth = pendingScrollSmoothRef.current
    pendingScrollSmoothRef.current = false
    const run = () => scrollToOffsetMs(offsetMs, smooth)
    const frame = smooth
      ? requestAnimationFrame(() => requestAnimationFrame(run))
      : requestAnimationFrame(run)
    return () => cancelAnimationFrame(frame)
  }, [zoomHalfExtentMs, plot, viewportWidth, scrollToOffsetMs])

  const plotDataFingerprint = plot
    ? `${logs.length}:${plot.points.length}:${plot.totalExtentMs}`
    : ""

  useEffect(() => {
    const el = plotColumnRef.current
    if (!el) return

    const update = () => setViewportWidth(el.clientWidth || 720)

    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!plot || !scrollRef.current) return
    const width = plotColumnRef.current?.clientWidth || viewportWidth
    if (width < 10) return

    const isDataRefresh =
      hasCenteredOnMountRef.current &&
      plotDataFingerprintRef.current !== "" &&
      plotDataFingerprintRef.current !== plotDataFingerprint

    plotDataFingerprintRef.current = plotDataFingerprint

    if (!hasCenteredOnMountRef.current) {
      hasCenteredOnMountRef.current = true
      const nowPx = sarTimelineNowPx(plot.totalExtentMs, zoomHalfExtentMs, width)
      applyScrollLeft(Math.max(0, nowPx - width / 2), false)
      savedCentreOffsetRef.current = 0
      return
    }

    if (!isDataRefresh) return

    const frame = requestAnimationFrame(() => {
      scrollToOffsetMs(savedCentreOffsetRef.current, false)
    })
    return () => cancelAnimationFrame(frame)
  }, [
    plotDataFingerprint,
    plot,
    viewportWidth,
    zoomHalfExtentMs,
    applyScrollLeft,
    scrollToOffsetMs,
  ])

  const shiftHours = (hours: number) => {
    if (!plot || !scrollRef.current) return
    const hourPx = sarTimelineHourScrollPx(
      plot.totalExtentMs,
      zoomHalfExtentMs,
      viewportWidth
    )
    applyScrollLeft(scrollRef.current.scrollLeft + hours * hourPx, true)
  }

  const zoomLevels = useMemo(
    () =>
      plot
        ? sarTimelineZoomLevelsForPlot(plot.totalExtentMs)
        : [SAR_TIMELINE_ZOOM_MAX_HALF_MS],
    [plot]
  )

  useEffect(() => {
    if (!plot) return
    const maxHalf = sarTimelineFitAllHalfMs(plot.totalExtentMs)
    setZoomHalfExtentMs((half) => {
      if (sarTimelineIsFullWindow(half, plot.totalExtentMs)) return maxHalf
      return Math.max(
        SAR_TIMELINE_ZOOM_MIN_HALF_MS,
        Math.min(maxHalf, half)
      )
    })
  }, [plot?.totalExtentMs])

  const changeZoom = (direction: "in" | "out") => {
    if (!plot) return
    const levels = sarTimelineZoomLevelsForPlot(plot.totalExtentMs)
    const index = sarTimelineZoomIndexForHalf(zoomHalfExtentMs, plot.totalExtentMs)
    const nextIndex =
      direction === "in"
        ? Math.max(0, index - 1)
        : Math.min(levels.length - 1, index + 1)
    if (nextIndex === index) return

    const el = scrollRef.current
    if (el) {
      const centrePx = el.scrollLeft + viewportWidth / 2
      pendingCentreOffsetRef.current =
        centrePx * sarTimelineMsPerPx(zoomHalfExtentMs, viewportWidth) -
        plot.totalExtentMs
      pendingScrollSmoothRef.current = false
    }

    const nextHalf =
      nextIndex === levels.length - 1
        ? sarTimelineFitAllHalfMs(plot.totalExtentMs)
        : levels[nextIndex]

    startTransition(() => {
      setZoomHalfExtentMs(nextHalf)
    })
  }

  const maxZoomHalf = plot
    ? sarTimelineFitAllHalfMs(plot.totalExtentMs)
    : SAR_TIMELINE_ZOOM_MAX_HALF_MS
  const minZoomHalf = zoomLevels[0] ?? SAR_TIMELINE_ZOOM_MIN_HALF_MS
  const canZoomIn = zoomHalfExtentMs > minZoomHalf + 500
  const canZoomOut = plot
    ? !sarTimelineIsFullWindow(zoomHalfExtentMs, plot.totalExtentMs)
    : zoomHalfExtentMs < maxZoomHalf - 500
  const isTightZoom = zoomHalfExtentMs <= 5 * 60 * 1000

  const canvasWidth = useMemo(
    () =>
      plot
        ? sarTimelineCanvasWidthPx(plot.totalExtentMs, zoomHalfExtentMs, viewportWidth)
        : 0,
    [plot, zoomHalfExtentMs, viewportWidth]
  )
  const plotHeight = plot ? plot.sars.length * ROW_HEIGHT_PX : 0
  const nowPx = useMemo(
    () =>
      plot
        ? sarTimelineNowPx(plot.totalExtentMs, zoomHalfExtentMs, viewportWidth)
        : 0,
    [plot, zoomHalfExtentMs, viewportWidth]
  )

  const visibleBounds = useMemo(
    () =>
      plot
        ? sarTimelineOffsetBoundsForScroll(
            scrollLeft,
            viewportWidth,
            plot.totalExtentMs,
            zoomHalfExtentMs
          )
        : { minOffsetMs: 0, maxOffsetMs: 0 },
    [plot, scrollLeft, viewportWidth, zoomHalfExtentMs]
  )

  const ticks = useMemo(
    () =>
      plot
        ? buildSarTimelineGridTicks(
            plot.totalExtentMs,
            zoomHalfExtentMs,
            viewportWidth,
            plot.now,
            visibleBounds
          )
        : [],
    [plot, zoomHalfExtentMs, viewportWidth, visibleBounds]
  )
  const timelineHeight = plotHeight + TICKS_HEIGHT_PX
  const highlightLower = highlightSar.trim().toLowerCase()

  const visiblePoints = useMemo(() => {
    if (!plot) return []
    const { minOffsetMs, maxOffsetMs } = visibleBounds
    return plot.points.filter((point) => {
      if (point.logId === focusedLogId) return true
      if (highlightLower && point.sar.toLowerCase() === highlightLower) return true
      return point.offsetMs >= minOffsetMs && point.offsetMs <= maxOffsetMs
    })
  }, [plot, visibleBounds, focusedLogId, highlightLower])

  const viewRange = useMemo(
    () =>
      plot
        ? sarTimelineViewportRange(
            scrollLeft,
            viewportWidth,
            plot.totalExtentMs,
            zoomHalfExtentMs,
            plot.now
          )
        : null,
    [plot, scrollLeft, viewportWidth, zoomHalfExtentMs]
  )

  const clearHoverTooltip = useCallback(() => {
    setHoveredPoint(null)
  }, [])

  const enableHoverTooltip = useCallback(() => {
    suppressHoverTooltipRef.current = false
  }, [])

  if (!plot || !viewRange) return null

  const selectedSar = highlightSar.trim()
  const canJumpToRecency = Boolean(selectedSar)

  const recencyLegendItems: {
    target: RecencyLegendTarget
    label: string
    markerClass: string
  }[] = [
    { target: "older", label: "Older", markerClass: "is-older-scan" },
    { target: 3, label: "3rd latest", markerClass: "is-recent-scan-3" },
    { target: 2, label: "2nd latest", markerClass: "is-recent-scan-2" },
    { target: 1, label: "Latest", markerClass: "is-latest-scan" },
  ]

  return (
    <div
      className={`tma-sar-timeline-chart${isTightZoom ? " is-tight-zoom" : ""}`}
      aria-label="Live sessions timeline"
      onMouseMove={enableHoverTooltip}
      onMouseLeave={clearHoverTooltip}
    >
      <div className="tma-sar-timeline-chart-body">
        <p className="tma-sar-timeline-view-range">
          <span className="tma-sar-timeline-view-range-label">Visible window</span>
          {formatSarTimelineViewRange(viewRange)}
        </p>

        <div className="tma-sar-timeline-y-corner" aria-hidden="true" />

        <div className="tma-sar-timeline-x-axis-hints" aria-hidden="true">
          <span className="tma-sar-timeline-x-hint tma-sar-timeline-x-hint--past">← Past</span>
          <span className="tma-sar-timeline-x-hint tma-sar-timeline-x-hint--future">
            Future →
          </span>
        </div>

        <div className="tma-sar-timeline-zoom" role="group" aria-label="Zoom timeline">
          <button
            type="button"
            className="tma-sar-timeline-zoom-btn"
            onClick={() => changeZoom("in")}
            disabled={!canZoomIn}
            aria-label="Zoom in (shorter time span)"
            title="Zoom in"
          >
            +
          </button>
          <span className="tma-sar-timeline-zoom-label">
            {formatSarTimelineZoomSpan(zoomHalfExtentMs, plot?.totalExtentMs)} window
          </span>
          <button
            type="button"
            className="tma-sar-timeline-zoom-btn"
            onClick={() => changeZoom("out")}
            disabled={!canZoomOut}
            aria-label="Zoom out (longer time span)"
            title="Zoom out"
          >
            −
          </button>
        </div>

        <div className="tma-sar-timeline-toolbar" role="group" aria-label="Scroll timeline">
          <div className="tma-sar-timeline-shift-group" aria-label="Scroll to past">
            {[1, 2, 3, 4].map((hours) => (
              <button
                key={`past-${hours}`}
                type="button"
                className="tma-sar-timeline-shift-btn"
                onClick={() => shiftHours(-hours)}
              >
                −{hours}h
              </button>
            ))}
          </div>
          <button type="button" className="tma-sar-timeline-center-btn" onClick={() => scrollToNow()}>
            Now
          </button>
          <div className="tma-sar-timeline-shift-group" aria-label="Scroll to future">
            {[4, 3, 2, 1].map((hours) => (
              <button
                key={`future-${hours}`}
                type="button"
                className="tma-sar-timeline-shift-btn"
                onClick={() => shiftHours(hours)}
              >
                +{hours}h
              </button>
            ))}
          </div>
        </div>

        <div className="tma-sar-timeline-y-axis-rows" aria-label="SAR users" style={{ height: plotHeight }}>
          {plot.sars.map((sar) => {
            const meta = rowMeta.get(sar)
            const isFocused = highlightLower && sar.toLowerCase() === highlightLower
            const isDimmed = Boolean(highlightLower && !isFocused)
            return (
              <button
                key={sar}
                type="button"
                className={`tma-sar-timeline-y-label${isFocused ? " is-focused" : ""}${isDimmed ? " is-dimmed" : ""}`}
                style={{ height: ROW_HEIGHT_PX, minHeight: ROW_HEIGHT_PX }}
                title={sar}
                onClick={() => onSelectSar?.(sar)}
              >
                <span className="tma-sar-timeline-y-label-sar">{truncateSarLabel(sar)}</span>
                {meta && (
                  <span className="tma-sar-timeline-y-label-meta">
                    {formatSarTimelineRowMetaSubtitle(meta)}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="tma-sar-timeline-plot-scroll-wrap" ref={plotColumnRef}>
          <div
            className="tma-sar-timeline-scroll-x"
            ref={scrollRef}
            onScroll={(event) => handleScroll(event.currentTarget.scrollLeft)}
          >
            <div
              className="tma-sar-timeline-canvas"
              style={{ width: canvasWidth, minWidth: "100%" }}
            >
              <div
                className="tma-sar-timeline-grid"
                style={{ height: plotHeight + TICKS_HEIGHT_PX }}
                aria-hidden="true"
              >
                {ticks
                  .filter((tick) => !tick.isTrueNow)
                  .map((tick) => (
                    <div
                      key={`grid-${tick.offsetMs}`}
                      className={`tma-sar-timeline-grid-line${tick.isHour ? " tma-sar-timeline-grid-line--hour" : ""}`}
                      style={{ left: tick.leftPx }}
                    />
                  ))}
                <div
                  className="tma-sar-timeline-grid-line tma-sar-timeline-grid-line--now"
                  style={{ left: nowPx }}
                  aria-hidden="true"
                />
              </div>

              <div
                className="tma-sar-timeline-now-marker"
                style={{ left: nowPx, height: timelineHeight }}
                aria-hidden="true"
              >
                <span className="tma-sar-timeline-now-line" aria-hidden="true" />
              </div>

              <div
                className="tma-sar-timeline-plot-area"
                style={{ height: plotHeight, width: canvasWidth }}
                onMouseLeave={clearHoverTooltip}
              >
                {plot.sars.map((sar, rowIndex) => {
                  const isDimmed = highlightLower && sar.toLowerCase() !== highlightLower
                  return (
                    <div
                      key={`row-${sar}`}
                      className={`tma-sar-timeline-row${isDimmed ? " is-dimmed" : ""}`}
                      style={{
                        top: rowIndex * ROW_HEIGHT_PX,
                        height: ROW_HEIGHT_PX,
                      }}
                    />
                  )
                })}

                {visiblePoints.map((point) => {
                  const rowIndex = plot.sars.indexOf(point.sar)
                  if (rowIndex < 0) return null
                  const recencyRank = recencyRanks.get(point.logId)
                  const left = sarTimelinePointPx(
                    point.offsetMs,
                    plot.totalExtentMs,
                    zoomHalfExtentMs,
                    viewportWidth
                  )
                  const top = rowIndex * ROW_HEIGHT_PX + ROW_HEIGHT_PX / 2
                  const isDimmed =
                    highlightLower && point.sar.toLowerCase() !== highlightLower
                  const isFreshLatest =
                    recencyRank === 1 && freshLatestLogIds.has(point.logId)
                  return (
                    <div
                      key={point.logId}
                      className={`tma-sar-timeline-marker-wrap${isDimmed ? " is-dimmed" : ""}`}
                      style={{
                        left,
                        top,
                      }}
                    >
                      {isFreshLatest && <SarOrbitStars />}
                      <button
                        type="button"
                        className={`tma-sar-timeline-marker${point.isRedirect ? " is-redirect" : " is-seen"}${recencyClassForRank(recencyRank)}${isFreshLatest ? " is-latest-fresh" : ""}${focusedLogId === point.logId ? " is-focused" : ""}${hoveredPoint?.logId === point.logId ? " is-active" : ""}`}
                        aria-label={`${point.artworkTitle}, ${point.messageType}`}
                        onMouseEnter={(event) => {
                          if (suppressHoverTooltipRef.current) return
                          setHoveredPoint(point)
                          setTooltipPos({ x: event.clientX, y: event.clientY })
                        }}
                        onMouseMove={(event) =>
                          setTooltipPos({ x: event.clientX, y: event.clientY })
                        }
                        onMouseLeave={() => setHoveredPoint(null)}
                        onFocus={(event) => {
                          if (suppressHoverTooltipRef.current) return
                          setHoveredPoint(point)
                          const rect = event.currentTarget.getBoundingClientRect()
                          setTooltipPos({
                            x: rect.left + rect.width / 2,
                            y: rect.top,
                          })
                        }}
                        onBlur={() => setHoveredPoint(null)}
                      />
                    </div>
                  )
                })}
              </div>

              <div
                className="tma-sar-timeline-ticks"
                style={{ height: TICKS_HEIGHT_PX, width: canvasWidth }}
                aria-label="Time axis (GMT)"
              >
                {ticks
                  .filter((tick) => !tick.isTrueNow)
                  .map((tick) => (
                    <span
                      key={`tick-${tick.offsetMs}`}
                      className={`tma-sar-timeline-tick${tick.isHour ? " is-hour" : ""}`}
                      style={{ left: tick.leftPx }}
                    >
                      {tick.label}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="tma-sar-timeline-legend">
          <div className="tma-sar-timeline-legend-group tma-sar-timeline-legend-group--order">
            <span className="tma-sar-timeline-legend-group-title">
              Scan order (per user, past ← → now)
              {canJumpToRecency && (
                <span className="tma-sar-timeline-legend-group-hint">
                  · click a colour to jump to that scan
                </span>
              )}
            </span>
            <div className="tma-sar-timeline-recency-legend">
              {recencyLegendItems.map(({ target, label, markerClass }) => {
                const point =
                  plot && selectedSar
                    ? findPointForSelectedSarRecency(plot.points, selectedSar, target)
                    : null
                const isDisabled = !canJumpToRecency || !point
                return (
                  <button
                    key={label}
                    type="button"
                    className={`tma-sar-timeline-recency-item${canJumpToRecency ? " is-clickable" : ""}`}
                    disabled={isDisabled}
                    title={
                      isDisabled
                        ? canJumpToRecency
                          ? `No ${label.toLowerCase()} scan for this session`
                          : "Select a session on the timeline first"
                        : `Jump to ${label.toLowerCase()} scan`
                    }
                    onClick={() => scrollToRecency(target)}
                  >
                    <span
                      className={`tma-sar-timeline-marker ${markerClass} tma-sar-timeline-marker--legend`}
                      aria-hidden="true"
                    />
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="tma-sar-timeline-legend-group tma-sar-timeline-legend-group--types">
            <span className="tma-sar-timeline-legend-item">
              <span
                className="tma-sar-timeline-marker is-redirect tma-sar-timeline-marker--legend"
                aria-hidden="true"
              />
              NFC scan
            </span>
            <span className="tma-sar-timeline-legend-item">
              <span
                className="tma-sar-timeline-marker is-seen tma-sar-timeline-marker--legend"
                aria-hidden="true"
              />
              Page visit
            </span>
          </div>
          <span className="tma-sar-timeline-legend-meta">
            Scroll horizontally · {plot.pastEdgeLabel} — {plot.futureEdgeLabel}
          </span>
        </div>
      </div>

      {hoveredPoint && (
        <div
          className="tma-sar-timeline-tooltip"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
          role="tooltip"
        >
          <strong>{hoveredPoint.artworkTitle}</strong>
          <span>{hoveredPoint.messageType}</span>
          <span>
            {formatLogTimestamp(hoveredPoint.timestamp.toISOString())?.date}{" "}
            {formatLogTimestamp(hoveredPoint.timestamp.toISOString())?.time}
          </span>
          <span className="tma-sar-timeline-tooltip-offset">
            {formatOffsetLabel(hoveredPoint.offsetMs)} from now
          </span>
        </div>
      )}
    </div>
  )
}
