import { SITE_META, type SiteScope } from "@tma/config"
import * as gallery from "@tma/analytics-gallery"
import * as museum from "@tma/analytics-museum"
import * as arkin from "@tma/analytics-arkin"
import * as churchOfEngland from "@tma/analytics-church-of-england"
import {
  buildVisitorNumberBySar,
  lookupVisitorNumber,
  sortSarsByVisitorNumber,
  formatVisitorNumber,
} from "./visitorNumbers"
import {
  getActiveCombinedSiteIds,
  isActiveCombinedSite,
} from "./combinedSites"

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

export { formatVisitorNumber, buildVisitorNumberBySar, lookupVisitorNumber }

function mergeUniqueLogs(...lists: PoiseLog[][]): PoiseLog[] {
  const seen = new Set<number>()
  const merged: PoiseLog[] = []
  for (const list of lists) {
    for (const row of list) {
      if (row.int_id == null || seen.has(row.int_id)) continue
      seen.add(row.int_id)
      merged.push(row)
    }
  }
  return merged
}

function getCombinedScopedLogs(logs: PoiseLog[]): PoiseLog[] {
  const lists: PoiseLog[][] = []
  if (isActiveCombinedSite("gallery")) lists.push(gallery.getGalleryLogs(logs))
  if (isActiveCombinedSite("museum")) lists.push(museum.getMuseumLogs(logs))
  if (isActiveCombinedSite("arkin")) lists.push(arkin.getArkinLogs(logs))
  if (isActiveCombinedSite("church_of_england")) {
    lists.push(churchOfEngland.getChurchOfEnglandLogs(logs))
  }
  return mergeUniqueLogs(...lists)
}

function combinedSitesLabel(): string {
  return getActiveCombinedSiteIds()
    .map((id) => {
      if (id === "gallery") return ".gallery"
      if (id === "museum") return ".museum"
      if (id === "arkin") return "Arkın"
      return SITE_META.church_of_england.domainLabel
    })
    .join(" + ")
}

function mergeSarTimelinePlots(
  plots: Array<gallery.SarTimelinePlot | null>,
  visitorBySar: Map<string, string>
): gallery.SarTimelinePlot | null {
  const valid = plots.filter((plot): plot is gallery.SarTimelinePlot => plot !== null)
  if (valid.length === 0) return null
  if (valid.length === 1) return sortPlotSarsByVisitor(valid[0], visitorBySar)
  const points = valid
    .flatMap((plot) => plot.points)
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
  const sars = sortSarsByVisitorNumber(
    [...new Set(valid.flatMap((plot) => plot.sars))],
    visitorBySar
  )
  const base = valid[0]
  return {
    sars,
    points,
    now: base.now,
    totalExtentMs: Math.max(...valid.map((plot) => plot.totalExtentMs)),
    viewportHalfExtentMs: base.viewportHalfExtentMs,
    pastEdgeLabel: base.pastEdgeLabel,
    futureEdgeLabel: base.futureEdgeLabel,
  }
}

export function buildActivityVisitDetails(
  log: PoiseLog,
  logs: PoiseLog[],
  scope: SiteScope
): gallery.ActivityVisitDetails {
  let details: gallery.ActivityVisitDetails
  if (scope === "combined") {
    if (gallery.getGalleryLogs([log]).length) {
      details = gallery.buildActivityVisitDetails(log)
    } else if (museum.getMuseumLogs([log]).length) {
      details = museum.buildActivityVisitDetails(log)
    } else if (arkin.getArkinLogs([log]).length) {
      details = arkin.buildActivityVisitDetails(log)
    } else {
      details = churchOfEngland.buildActivityVisitDetails(log)
    }
  } else if (scope === "arkin") {
    details = arkin.buildActivityVisitDetails(log)
  } else if (scope === "museum") {
    details = museum.buildActivityVisitDetails(log)
  } else if (scope === "church_of_england") {
    details = churchOfEngland.buildActivityVisitDetails(log)
  } else {
    details = gallery.buildActivityVisitDetails(log)
  }
  if (!details.sar) return details
  const visitorNumber = lookupVisitorNumber(
    details.sar,
    buildVisitorNumberBySar(logs, scope)
  )
  if (!visitorNumber) return details
  return { ...details, visitorNumber }
}

export type ActivityEntry =
  | gallery.GalleryActivityEntry
  | churchOfEngland.ChurchOfEnglandActivityEntry

export function getScopedLogs(logs: PoiseLog[], scope: SiteScope): PoiseLog[] {
  if (scope === "gallery") return gallery.getGalleryLogs(logs)
  if (scope === "arkin") return arkin.getArkinLogs(logs)
  if (scope === "museum") return museum.getMuseumLogs(logs)
  if (scope === "church_of_england") return churchOfEngland.getChurchOfEnglandLogs(logs)
  return getCombinedScopedLogs(logs)
}

export function trackedArtworkCount(scope: SiteScope): number {
  if (scope === "gallery") return gallery.TRACKED_GALLERY_ARTWORKS.length
  if (scope === "arkin") return arkin.TRACKED_ARKIN_ARTWORKS.length
  if (scope === "museum") return museum.TRACKED_MUSEUM_ARTWORKS.length
  if (scope === "church_of_england") {
    return churchOfEngland.TRACKED_CHURCH_OF_ENGLAND_ARTWORKS.length
  }
  return getActiveCombinedSiteIds().reduce((count, siteId) => {
    if (siteId === "gallery") return count + gallery.TRACKED_GALLERY_ARTWORKS.length
    if (siteId === "museum") return count + museum.TRACKED_MUSEUM_ARTWORKS.length
    if (siteId === "arkin") return count + arkin.TRACKED_ARKIN_ARTWORKS.length
    return count + churchOfEngland.TRACKED_CHURCH_OF_ENGLAND_ARTWORKS.length
  }, 0)
}

export function trackedScansMeta(scope: SiteScope): string {
  if (scope === "gallery") return "tracked .gallery scans"
  if (scope === "arkin") return "tracked Arkın scans"
  if (scope === "museum") return "tracked .museum scans"
  if (scope === "church_of_england") return "tracked Church of England scans"
  return `tracked ${combinedSitesLabel()} scans`
}

export function trackedLinksMeta(scope: SiteScope): string {
  const count = trackedArtworkCount(scope)
  if (scope === "gallery") return `of ${count} tracked .gallery links`
  if (scope === "arkin") return `of ${count} tracked Arkın links`
  if (scope === "museum") return `of ${count} tracked .museum links`
  if (scope === "church_of_england") return `of ${count} tracked Church of England links`
  return `of ${count} tracked links (all sites)`
}

export function trackedScansAcrossMeta(scope: SiteScope): string {
  if (scope === "gallery") return "across tracked .gallery links"
  if (scope === "arkin") return "across tracked Arkın links"
  if (scope === "museum") return "across tracked .museum links"
  if (scope === "church_of_england") return "across tracked Church of England links"
  return "across tracked links (all sites)"
}

export function sarTimelineDomainLabel(scope: SiteScope): string {
  if (scope === "gallery") return "takemearound.gallery"
  if (scope === "arkin") return "arkin.takemearound.gallery"
  if (scope === "museum") return "takemearound.museum"
  if (scope === "church_of_england") return "church.takemearound.gallery"
  return getActiveCombinedSiteIds()
    .map((id) => SITE_META[id].host)
    .join(" + ")
}

export function sarTimelineDomainSuffix(scope: SiteScope): string {
  if (scope === "gallery") return ".gallery"
  if (scope === "arkin") return "Arkın"
  if (scope === "museum") return ".museum"
  if (scope === "church_of_england") return "Church of England"
  return "selected sites"
}

export function emptyActivityMessage(scope: SiteScope): string {
  if (scope === "gallery") return "No tracked .gallery activity found."
  if (scope === "arkin") return "No tracked Arkın activity found."
  if (scope === "museum") return "No tracked .museum activity found."
  if (scope === "church_of_england") return "No tracked Church of England activity found."
  return "No tracked activity found for the selected scope."
}

export function buildActivityEntries(logs: PoiseLog[], scope: SiteScope): ActivityEntry[] {
  if (scope === "gallery") return gallery.buildGalleryActivityEntries(logs)
  if (scope === "arkin") return arkin.buildArkinActivityEntries(logs)
  if (scope === "museum") return museum.buildMuseumActivityEntries(logs)
  if (scope === "church_of_england") {
    return churchOfEngland.buildChurchOfEnglandActivityEntries(logs)
  }
  const merged = getActiveCombinedSiteIds().flatMap((siteId) => {
    if (siteId === "gallery") return gallery.buildGalleryActivityEntries(logs)
    if (siteId === "museum") return museum.buildMuseumActivityEntries(logs)
    if (siteId === "arkin") return arkin.buildArkinActivityEntries(logs)
    return churchOfEngland.buildChurchOfEnglandActivityEntries(logs)
  })
  return merged.sort((a, b) => {
    const aTime = parseLogTimestampGmt(a.timestamp)?.getTime() ?? 0
    const bTime = parseLogTimestampGmt(b.timestamp)?.getTime() ?? 0
    return bTime - aTime
  })
}

export function buildTrackedArtworkScanGroups(logs: PoiseLog[], scope: SiteScope) {
  if (scope === "gallery") return gallery.buildTrackedArtworkScanGroups(logs)
  if (scope === "arkin") return arkin.buildTrackedArtworkScanGroups(logs)
  if (scope === "museum") return museum.buildTrackedArtworkScanGroups(logs)
  if (scope === "church_of_england") {
    return churchOfEngland.buildTrackedArtworkScanGroups(logs)
  }
  const groups = []
  for (const siteId of getActiveCombinedSiteIds()) {
    if (siteId === "gallery") {
      groups.push(...gallery.buildTrackedArtworkScanGroups(logs))
    } else if (siteId === "museum") {
      groups.push(...museum.buildTrackedArtworkScanGroups(logs))
    } else if (siteId === "arkin") {
      groups.push(...arkin.buildTrackedArtworkScanGroups(logs))
    } else {
      groups.push(...churchOfEngland.buildTrackedArtworkScanGroups(logs))
    }
  }
  return groups.sort((a, b) => b.scans.length - a.scans.length)
}

export function buildOverviewAnalytics(logs: PoiseLog[], scope: SiteScope) {
  if (scope === "gallery") return gallery.buildOverviewAnalytics(logs)
  if (scope === "arkin") return arkin.buildOverviewAnalytics(logs)
  if (scope === "museum") return museum.buildOverviewAnalytics(logs)
  if (scope === "church_of_england") return churchOfEngland.buildOverviewAnalytics(logs)
  const g = gallery.buildOverviewAnalytics(logs)
  const m = museum.buildOverviewAnalytics(logs)
  const a = arkin.buildOverviewAnalytics(logs)
  const c = churchOfEngland.buildOverviewAnalytics(logs)
  const siteStats = getActiveCombinedSiteIds().map((siteId) => {
    if (siteId === "gallery") return g
    if (siteId === "museum") return m
    if (siteId === "arkin") return a
    return c
  })
  const totalTaps = siteStats.reduce((sum, stats) => sum + stats.totalTaps, 0)
  const activeTags = siteStats.reduce((sum, stats) => sum + stats.activeTags, 0)
  const topSite = siteStats.reduce((best, cur) =>
    cur.totalTaps >= best.totalTaps ? cur : best
  )
  return {
    totalTaps,
    activeTags,
    topTagName: topSite.topTagName,
    topTagMonthCount: siteStats.reduce((sum, stats) => sum + stats.topTagMonthCount, 0),
    avgPerTag: activeTags > 0 ? Math.round(totalTaps / activeTags) : 0,
    weeklyChange:
      siteStats.reduce((sum, stats) => sum + stats.weeklyChange, 0) / siteStats.length,
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
  if (scope === "arkin") return arkin.buildAudienceAnalytics(logs)
  if (scope === "museum") return museum.buildAudienceAnalytics(logs)
  if (scope === "church_of_england") return churchOfEngland.buildAudienceAnalytics(logs)
  const enabled = getActiveCombinedSiteIds()
  const analyticsBySite = {
    gallery: () => gallery.buildAudienceAnalytics(logs),
    museum: () => museum.buildAudienceAnalytics(logs),
    arkin: () => arkin.buildAudienceAnalytics(logs),
    church_of_england: () => churchOfEngland.buildAudienceAnalytics(logs),
  } satisfies Record<import("@tma/config").SiteId, () => AudienceAnalytics>
  let merged: AudienceAnalytics | null = null
  for (const siteId of enabled) {
    const next = analyticsBySite[siteId]()
    merged = merged ? mergeAudienceAnalytics(merged, next) : next
  }
  return merged ?? gallery.buildAudienceAnalytics(logs)
}

export function buildWeeklySeries(
  logs: PoiseLog[],
  weekOffset: number,
  scope: SiteScope
): gallery.TimeSeriesWindow {
  if (scope === "gallery") return gallery.buildWeeklySeries(logs, weekOffset)
  if (scope === "arkin") return arkin.buildWeeklySeries(logs, weekOffset)
  if (scope === "museum") return museum.buildWeeklySeries(logs, weekOffset)
  if (scope === "church_of_england") return churchOfEngland.buildWeeklySeries(logs, weekOffset)
  const g = gallery.buildWeeklySeries(logs, weekOffset)
  const m = museum.buildWeeklySeries(logs, weekOffset)
  const a = arkin.buildWeeklySeries(logs, weekOffset)
  const c = churchOfEngland.buildWeeklySeries(logs, weekOffset)
  const seriesBySite = {
    gallery: g,
    museum: m,
    arkin: a,
    church_of_england: c,
  } satisfies Record<import("@tma/config").SiteId, gallery.TimeSeriesWindow>
  const enabled = getActiveCombinedSiteIds()
  const primary = seriesBySite[enabled[0] ?? "gallery"]
  return {
    series: primary.series.map((point, index) => ({
      ...point,
      count: enabled.reduce(
        (sum, siteId) => sum + (seriesBySite[siteId].series[index]?.count ?? 0),
        0
      ),
    })),
    periodLabel: primary.periodLabel,
    canGoForward: enabled.every((siteId) => seriesBySite[siteId].canGoForward),
  }
}

export function buildMonthlyCalendarGrid(
  logs: PoiseLog[],
  monthOffset: number,
  scope: SiteScope
): gallery.MonthlyCalendarWindow {
  if (scope === "gallery") return gallery.buildMonthlyCalendarGrid(logs, monthOffset)
  if (scope === "arkin") return arkin.buildMonthlyCalendarGrid(logs, monthOffset)
  if (scope === "museum") return museum.buildMonthlyCalendarGrid(logs, monthOffset)
  if (scope === "church_of_england") {
    return churchOfEngland.buildMonthlyCalendarGrid(logs, monthOffset)
  }
  const g = gallery.buildMonthlyCalendarGrid(logs, monthOffset)
  const m = museum.buildMonthlyCalendarGrid(logs, monthOffset)
  const a = arkin.buildMonthlyCalendarGrid(logs, monthOffset)
  const c = churchOfEngland.buildMonthlyCalendarGrid(logs, monthOffset)
  const gridsBySite = {
    gallery: g,
    museum: m,
    arkin: a,
    church_of_england: c,
  } satisfies Record<import("@tma/config").SiteId, gallery.MonthlyCalendarWindow>
  const enabled = getActiveCombinedSiteIds()
  const primary = gridsBySite[enabled[0] ?? "gallery"]
  return {
    series: primary.series.map((point, index) => ({
      ...point,
      count: enabled.reduce(
        (sum, siteId) => sum + (gridsBySite[siteId].series[index]?.count ?? 0),
        0
      ),
    })),
    weeks: primary.weeks.map((week, weekIndex) =>
      week.map((cell, dayIndex) => {
        if (cell.kind === "padding") return cell
        const extra = enabled.reduce((sum, siteId) => {
          const other = gridsBySite[siteId].weeks[weekIndex]?.[dayIndex]
          return sum + (other && other.kind !== "padding" ? other.count : 0)
        }, 0)
        return { ...cell, count: cell.count + extra }
      })
    ),
    periodLabel: primary.periodLabel,
    canGoForward: enabled.every((siteId) => gridsBySite[siteId].canGoForward),
  }
}

export const buildWeekTotalsFromSeries = gallery.buildWeekTotalsFromSeries

export function listDistinctSars(logs: PoiseLog[], scope: SiteScope): string[] {
  if (scope === "gallery") return gallery.listDistinctGallerySars(logs)
  if (scope === "arkin") return arkin.listDistinctArkinSars(logs)
  if (scope === "museum") return museum.listDistinctMuseumSars(logs)
  if (scope === "church_of_england") return churchOfEngland.listDistinctChurchOfEnglandSars(logs)
  return [
    ...new Set(
      getActiveCombinedSiteIds().flatMap((siteId) => {
        if (siteId === "gallery") return gallery.listDistinctGallerySars(logs)
        if (siteId === "museum") return museum.listDistinctMuseumSars(logs)
        if (siteId === "arkin") return arkin.listDistinctArkinSars(logs)
        return churchOfEngland.listDistinctChurchOfEnglandSars(logs)
      })
    ),
  ].sort((a, b) => a.localeCompare(b))
}

export function buildSarTimelineEvents(
  logs: PoiseLog[],
  sarQuery: string,
  scope: SiteScope
): ActivityEntry[] {
  if (scope === "gallery") return gallery.buildSarGalleryTimelineEvents(logs, sarQuery)
  if (scope === "arkin") return arkin.buildSarArkinTimelineEvents(logs, sarQuery)
  if (scope === "museum") return museum.buildSarMuseumTimelineEvents(logs, sarQuery)
  if (scope === "church_of_england") {
    return churchOfEngland.buildSarChurchOfEnglandTimelineEvents(logs, sarQuery)
  }
  const merged = getActiveCombinedSiteIds().flatMap((siteId) => {
    if (siteId === "gallery") return gallery.buildSarGalleryTimelineEvents(logs, sarQuery)
    if (siteId === "museum") return museum.buildSarMuseumTimelineEvents(logs, sarQuery)
    if (siteId === "arkin") return arkin.buildSarArkinTimelineEvents(logs, sarQuery)
    return churchOfEngland.buildSarChurchOfEnglandTimelineEvents(logs, sarQuery)
  })
  return merged.sort((a, b) => {
    const aTime = parseLogTimestampGmt(a.timestamp)?.getTime() ?? 0
    const bTime = parseLogTimestampGmt(b.timestamp)?.getTime() ?? 0
    return bTime - aTime
  })
}

function applyVisitorNumbersToRowMeta(
  meta: Map<string, gallery.SarTimelineRowMeta>,
  visitorBySar: Map<string, string>
) {
  for (const entry of meta.values()) {
    entry.visitorNumber = lookupVisitorNumber(entry.sar, visitorBySar)
  }
}

export function buildSarTimelineRowMetaMap(
  logs: PoiseLog[],
  scope: SiteScope
): Map<string, gallery.SarTimelineRowMeta> {
  const visitorBySar = buildVisitorNumberBySar(logs, scope)
  let meta: Map<string, gallery.SarTimelineRowMeta>
  if (scope === "arkin") {
    meta = arkin.buildSarTimelineRowMetaMap(logs)
  } else if (scope === "museum") {
    meta = museum.buildSarTimelineRowMetaMap(logs)
  } else if (scope === "church_of_england") {
    meta = churchOfEngland.buildSarTimelineRowMetaMap(logs)
  } else if (scope === "gallery") {
    meta = gallery.buildSarTimelineRowMetaMap(logs)
  } else {
    meta = new Map<string, gallery.SarTimelineRowMeta>()
    for (const siteId of getActiveCombinedSiteIds()) {
      const siteMeta =
        siteId === "gallery"
          ? gallery.buildSarTimelineRowMetaMap(logs)
          : siteId === "museum"
            ? museum.buildSarTimelineRowMetaMap(logs)
            : siteId === "arkin"
              ? arkin.buildSarTimelineRowMetaMap(logs)
              : churchOfEngland.buildSarTimelineRowMetaMap(logs)
      for (const [sar, row] of siteMeta) {
        if (!meta.has(sar)) meta.set(sar, row)
      }
    }
  }
  applyVisitorNumbersToRowMeta(meta, visitorBySar)
  return meta
}

export function formatSarTimelineRowMetaSubtitle(meta: gallery.SarTimelineRowMeta) {
  const geo = gallery.formatSarTimelineRowMetaSubtitle(meta)
  const parts = [truncateSarForSubtitle(meta.sar), geo !== "—" ? geo : null].filter(Boolean)
  return parts.length > 0 ? parts.join(" · ") : "—"
}

function truncateSarForSubtitle(sar: string) {
  if (sar.length <= 16) return sar
  return `${sar.slice(0, 7)}…${sar.slice(-5)}`
}

function sortPlotSarsByVisitor(
  plot: gallery.SarTimelinePlot,
  visitorBySar: Map<string, string>
): gallery.SarTimelinePlot {
  return {
    ...plot,
    sars: sortSarsByVisitorNumber(plot.sars, visitorBySar),
  }
}

export function buildSarTimelinePlot(
  logs: PoiseLog[],
  scope: SiteScope
): gallery.SarTimelinePlot | null {
  const visitorBySar = buildVisitorNumberBySar(logs, scope)
  if (scope === "gallery") {
    const plot = gallery.buildSarTimelinePlot(logs)
    return plot ? sortPlotSarsByVisitor(plot, visitorBySar) : null
  }
  if (scope === "museum") {
    const plot = museum.buildSarTimelinePlot(logs)
    return plot ? sortPlotSarsByVisitor(plot, visitorBySar) : null
  }
  if (scope === "arkin") {
    const plot = arkin.buildSarTimelinePlot(logs)
    return plot ? sortPlotSarsByVisitor(plot, visitorBySar) : null
  }
  if (scope === "church_of_england") {
    const plot = churchOfEngland.buildSarTimelinePlot(logs)
    return plot ? sortPlotSarsByVisitor(plot, visitorBySar) : null
  }
  const plots = getActiveCombinedSiteIds().map((siteId) => {
    if (siteId === "gallery") return gallery.buildSarTimelinePlot(logs)
    if (siteId === "museum") return museum.buildSarTimelinePlot(logs)
    if (siteId === "arkin") return arkin.buildSarTimelinePlot(logs)
    return churchOfEngland.buildSarTimelinePlot(logs)
  })
  return mergeSarTimelinePlots(plots, visitorBySar)
}

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

export { setActiveCombinedSiteIds, getActiveCombinedSiteIds } from "./combinedSites"
