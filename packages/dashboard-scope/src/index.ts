import type { SiteScope } from "@tma/config"
import * as gallery from "@tma/analytics-gallery"
import * as museum from "@tma/analytics-museum"

export type PoiseLog = gallery.PoiseLog
export type { ActivityVisitDetails } from "@tma/analytics-gallery"
export type {
  BrowserKind,
  DeviceKind,
  OperatingSystemKind,
  AudienceBreakdownRow,
  CalendarDayCell,
  MonthlyCalendarWindow,
  TimeSeriesPoint,
  TimeSeriesWindow,
  WeekTotal,
  SarTimelinePlot,
  SarTimelinePlotPoint,
  SarTimelineRowMeta,
  SarTimelineViewportRange,
  SarTimelineGridTick,
} from "@tma/analytics-gallery"

export const parseLogTimestampGmt = gallery.parseLogTimestampGmt
export const formatNumber = gallery.formatNumber
export const formatSignedPercent = gallery.formatSignedPercent
export const formatAndroidField = gallery.formatAndroidField
export const buildActivityVisitDetails = gallery.buildActivityVisitDetails

export type ActivityEntry = gallery.GalleryActivityEntry

export function getScopedLogs(logs: PoiseLog[], scope: SiteScope): PoiseLog[] {
  if (scope === "gallery") return gallery.getGalleryLogs(logs)
  if (scope === "museum") return museum.getMuseumLogs(logs)
  const seen = new Set<number>()
  const merged: PoiseLog[] = []
  for (const row of gallery.getGalleryLogs(logs)) {
    if (seen.has(row.int_id)) continue
    seen.add(row.int_id)
    merged.push(row)
  }
  for (const row of museum.getMuseumLogs(logs)) {
    if (seen.has(row.int_id)) continue
    seen.add(row.int_id)
    merged.push(row)
  }
  return merged
}

export function trackedArtworkCount(scope: SiteScope): number {
  if (scope === "gallery") return gallery.TRACKED_GALLERY_ARTWORKS.length
  if (scope === "museum") return museum.TRACKED_MUSEUM_ARTWORKS.length
  return gallery.TRACKED_GALLERY_ARTWORKS.length + museum.TRACKED_MUSEUM_ARTWORKS.length
}

export function trackedScansMeta(scope: SiteScope): string {
  if (scope === "gallery") return "tracked .gallery scans"
  if (scope === "museum") return "tracked .museum scans"
  return "tracked .gallery + .museum scans"
}

export function trackedLinksMeta(scope: SiteScope): string {
  const count = trackedArtworkCount(scope)
  if (scope === "gallery") return `of ${count} tracked .gallery links`
  if (scope === "museum") return `of ${count} tracked .museum links`
  return `of ${count} tracked links (both sites)`
}

export function trackedScansAcrossMeta(scope: SiteScope): string {
  if (scope === "gallery") return "across tracked .gallery links"
  if (scope === "museum") return "across tracked .museum links"
  return "across tracked links (both sites)"
}

export function sarTimelineDomainLabel(scope: SiteScope): string {
  if (scope === "gallery") return "takemearound.gallery"
  if (scope === "museum") return "takemearound.museum"
  return "takemearound.gallery + takemearound.museum"
}

export function sarTimelineDomainSuffix(scope: SiteScope): string {
  if (scope === "gallery") return ".gallery"
  if (scope === "museum") return ".museum"
  return "selected sites"
}

export function emptyActivityMessage(scope: SiteScope): string {
  if (scope === "gallery") return "No tracked .gallery activity found."
  if (scope === "museum") return "No tracked .museum activity found."
  return "No tracked activity found for the selected scope."
}

export function buildActivityEntries(logs: PoiseLog[], scope: SiteScope): ActivityEntry[] {
  if (scope === "gallery") return gallery.buildGalleryActivityEntries(logs)
  if (scope === "museum") return museum.buildMuseumActivityEntries(logs)
  const merged = [
    ...gallery.buildGalleryActivityEntries(logs),
    ...museum.buildMuseumActivityEntries(logs),
  ]
  return merged.sort((a, b) => {
    const aTime = parseLogTimestampGmt(a.timestamp)?.getTime() ?? 0
    const bTime = parseLogTimestampGmt(b.timestamp)?.getTime() ?? 0
    return bTime - aTime
  })
}

export function buildTrackedArtworkScanGroups(logs: PoiseLog[], scope: SiteScope) {
  if (scope === "gallery") return gallery.buildTrackedArtworkScanGroups(logs)
  if (scope === "museum") return museum.buildTrackedArtworkScanGroups(logs)
  const groups = [
    ...gallery.buildTrackedArtworkScanGroups(logs),
    ...museum.buildTrackedArtworkScanGroups(logs),
  ]
  return groups.sort((a, b) => b.scans.length - a.scans.length)
}

export function buildOverviewAnalytics(logs: PoiseLog[], scope: SiteScope) {
  if (scope === "gallery") return gallery.buildOverviewAnalytics(logs)
  if (scope === "museum") return museum.buildOverviewAnalytics(logs)
  const g = gallery.buildOverviewAnalytics(logs)
  const m = museum.buildOverviewAnalytics(logs)
  const totalTaps = g.totalTaps + m.totalTaps
  const activeTags = g.activeTags + m.activeTags
  return {
    totalTaps,
    activeTags,
    topTagName: g.totalTaps >= m.totalTaps ? g.topTagName : m.topTagName,
    topTagMonthCount: g.topTagMonthCount + m.topTagMonthCount,
    avgPerTag: activeTags > 0 ? Math.round(totalTaps / activeTags) : 0,
    weeklyChange: (g.weeklyChange + m.weeklyChange) / 2,
  }
}

type AudienceAnalytics = ReturnType<typeof gallery.buildAudienceAnalytics>

function mergeAudienceAnalytics(g: AudienceAnalytics, m: AudienceAnalytics): AudienceAnalytics {
  const hourlyCounts = g.hourly.map((item, index) => item.count + (m.hourly[index]?.count ?? 0))
  const dailyCounts = g.daily.map((item, index) => item.count + (m.daily[index]?.count ?? 0))
  const hourlyMax = Math.max(...hourlyCounts, 1)
  const dailyMax = Math.max(...dailyCounts, 1)

  const mergeKindRows = <T extends { kind: string; count: number; percent: number }>(
    a: T[],
    b: T[]
  ) => {
    const map = new Map<string, number>()
    for (const row of [...a, ...b]) {
      map.set(row.kind, (map.get(row.kind) ?? 0) + row.count)
    }
    const total = [...map.values()].reduce((sum, count) => sum + count, 0)
    return [...map.entries()].map(([kind, count]) => ({
      kind,
      count,
      percent: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
  }

  const mergeLabelRows = (a: { label: string; count: number; percent: number }[], b: typeof a) => {
    const map = new Map<string, number>()
    for (const row of [...a, ...b]) {
      map.set(row.label, (map.get(row.label) ?? 0) + row.count)
    }
    const total = [...map.values()].reduce((sum, count) => sum + count, 0)
    return [...map.entries()]
      .map(([label, count]) => ({
        label,
        count,
        percent: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
  }

  const deviceInfo = mergeLabelRows(g.deviceInfo, m.deviceInfo) as AudienceAnalytics["deviceInfo"]
  const languages = mergeLabelRows(g.languages, m.languages) as AudienceAnalytics["languages"]

  return {
    devices: mergeKindRows(g.devices, m.devices) as AudienceAnalytics["devices"],
    browsers: mergeKindRows(g.browsers, m.browsers) as AudienceAnalytics["browsers"],
    hourly: hourlyCounts.map((count, hour) => ({
      hour,
      count,
      intensity: count / hourlyMax,
    })),
    daily: dailyCounts.map((count, weekday) => ({
      weekday,
      label: g.daily[weekday]?.label ?? m.daily[weekday]?.label ?? "",
      count,
      intensity: count / dailyMax,
    })),
    hasDeviceData: g.hasDeviceData || m.hasDeviceData,
    deviceInfo,
    languages,
    hasDeviceInfoData: g.hasDeviceInfoData || m.hasDeviceInfoData,
    hasLanguageData: g.hasLanguageData || m.hasLanguageData,
  }
}

export function buildAudienceAnalytics(logs: PoiseLog[], scope: SiteScope): AudienceAnalytics {
  if (scope === "gallery") return gallery.buildAudienceAnalytics(logs)
  if (scope === "museum") return museum.buildAudienceAnalytics(logs)
  return mergeAudienceAnalytics(
    gallery.buildAudienceAnalytics(logs),
    museum.buildAudienceAnalytics(logs)
  )
}

export function buildWeeklySeries(
  logs: PoiseLog[],
  weekOffset: number,
  scope: SiteScope
): gallery.TimeSeriesWindow {
  if (scope === "gallery") return gallery.buildWeeklySeries(logs, weekOffset)
  if (scope === "museum") return museum.buildWeeklySeries(logs, weekOffset)
  const g = gallery.buildWeeklySeries(logs, weekOffset)
  const m = museum.buildWeeklySeries(logs, weekOffset)
  return {
    series: g.series.map((point, index) => ({
      ...point,
      count: point.count + (m.series[index]?.count ?? 0),
    })),
    periodLabel: g.periodLabel,
    canGoForward: g.canGoForward && m.canGoForward,
  }
}

export function buildMonthlyCalendarGrid(
  logs: PoiseLog[],
  monthOffset: number,
  scope: SiteScope
): gallery.MonthlyCalendarWindow {
  if (scope === "gallery") return gallery.buildMonthlyCalendarGrid(logs, monthOffset)
  if (scope === "museum") return museum.buildMonthlyCalendarGrid(logs, monthOffset)
  const g = gallery.buildMonthlyCalendarGrid(logs, monthOffset)
  const m = museum.buildMonthlyCalendarGrid(logs, monthOffset)
  return {
    series: g.series.map((point, index) => ({
      ...point,
      count: point.count + (m.series[index]?.count ?? 0),
    })),
    weeks: g.weeks.map((week, weekIndex) =>
      week.map((cell, dayIndex) => {
        if (cell.kind === "padding") return cell
        const other = m.weeks[weekIndex]?.[dayIndex]
        if (!other || other.kind === "padding") return cell
        return { ...cell, count: cell.count + other.count }
      })
    ),
    periodLabel: g.periodLabel,
    canGoForward: g.canGoForward && m.canGoForward,
  }
}

export const buildWeekTotalsFromSeries = gallery.buildWeekTotalsFromSeries

export function listDistinctSars(logs: PoiseLog[], scope: SiteScope): string[] {
  if (scope === "gallery") return gallery.listDistinctGallerySars(logs)
  if (scope === "museum") return museum.listDistinctMuseumSars(logs)
  return [...new Set([...gallery.listDistinctGallerySars(logs), ...museum.listDistinctMuseumSars(logs)])].sort(
    (a, b) => a.localeCompare(b)
  )
}

export function buildSarTimelineEvents(logs: PoiseLog[], sarQuery: string, scope: SiteScope) {
  if (scope === "gallery") return gallery.buildSarGalleryTimelineEvents(logs, sarQuery)
  if (scope === "museum") return museum.buildSarMuseumTimelineEvents(logs, sarQuery)
  const merged = [
    ...gallery.buildSarGalleryTimelineEvents(logs, sarQuery),
    ...museum.buildSarMuseumTimelineEvents(logs, sarQuery),
  ]
  return merged.sort((a, b) => {
    const aTime = parseLogTimestampGmt(a.timestamp)?.getTime() ?? 0
    const bTime = parseLogTimestampGmt(b.timestamp)?.getTime() ?? 0
    return bTime - aTime
  })
}

export function buildSarTimelinePlot(
  logs: PoiseLog[],
  scope: SiteScope
): gallery.SarTimelinePlot | null {
  if (scope === "gallery") return gallery.buildSarTimelinePlot(logs)
  if (scope === "museum") return museum.buildSarTimelinePlot(logs)
  const g = gallery.buildSarTimelinePlot(logs)
  const m = museum.buildSarTimelinePlot(logs)
  if (!g && !m) return null
  if (!g) return m
  if (!m) return g
  const nowMs = g.now.getTime()
  const totalExtentMs = Math.max(g.totalExtentMs, m.totalExtentMs)
  const points = [...g.points, ...m.points].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  )
  const sars = [...new Set([...g.sars, ...m.sars])].sort((a, b) => a.localeCompare(b))
  return {
    sars,
    points,
    now: g.now,
    totalExtentMs,
    viewportHalfExtentMs: g.viewportHalfExtentMs,
    pastEdgeLabel: g.pastEdgeLabel,
    futureEdgeLabel: g.futureEdgeLabel,
  }
}

export const buildSarTimelineRowMetaMap = gallery.buildSarTimelineRowMetaMap
export const formatSarTimelineRowMetaSubtitle = gallery.formatSarTimelineRowMetaSubtitle
export const sarTimelineCanvasWidthPx = gallery.sarTimelineCanvasWidthPx
export const sarTimelineNowPx = gallery.sarTimelineNowPx
export const sarTimelinePointPx = gallery.sarTimelinePointPx
export const sarTimelineHourScrollPx = gallery.sarTimelineHourScrollPx
export const buildSarTimelineGridTicks = gallery.buildSarTimelineGridTicks
export const sarTimelineViewportRange = gallery.sarTimelineViewportRange
export const formatSarTimelineViewRange = gallery.formatSarTimelineViewRange
export const SAR_TIMELINE_ZOOM_MIN_HALF_MS = gallery.SAR_TIMELINE_ZOOM_MIN_HALF_MS
export const SAR_TIMELINE_ZOOM_MAX_HALF_MS = gallery.SAR_TIMELINE_ZOOM_MAX_HALF_MS
export const SAR_TIMELINE_ZOOM_LEVELS_HALF_MS = gallery.SAR_TIMELINE_ZOOM_LEVELS_HALF_MS
export const formatSarTimelineZoomSpan = gallery.formatSarTimelineZoomSpan
export const sarTimelineFitAllHalfMs = gallery.sarTimelineFitAllHalfMs
export const sarTimelineZoomLevelsForPlot = gallery.sarTimelineZoomLevelsForPlot
export const sarTimelineZoomIndexForHalf = gallery.sarTimelineZoomIndexForHalf
export const sarTimelineMapExtentMs = gallery.sarTimelineMapExtentMs
export const sarTimelineMsPerPx = gallery.sarTimelineMsPerPx
export const sarTimelineIsFullWindow = gallery.sarTimelineIsFullWindow
export const formatSarTimelineMonthLabel = gallery.formatSarTimelineMonthLabel
export const sarTimelineOffsetBoundsForScroll = gallery.sarTimelineOffsetBoundsForScroll
export type SarTimelineOffsetBounds = gallery.SarTimelineOffsetBounds
