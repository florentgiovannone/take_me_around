import { canonicalBirminghamTagName } from "@tma/config"
import * as gallery from "@tma/analytics-gallery"
import * as museum from "@tma/analytics-museum"
import type { PoiseLog } from "@tma/analytics-gallery"

const ARTWORKS = [
  {
    slug: "the-star-of-betlehem",
    host: "takemearound.gallery",
    path: "/the-star-of-betlehem",
    title: "The Star of Betlehem",
    dashboardTitle: "The Star of Betlehem · .gallery",
    domainLabel: ".gallery",
  },
  {
    slug: "the-golden-boys",
    host: "takemearound.museum",
    path: "/the-golden-boys",
    title: "The Golden Boys",
    dashboardTitle: "The Golden Boys · .museum",
    domainLabel: ".museum",
  },
] as const

export type BirminghamConferenceArtwork = (typeof ARTWORKS)[number] & { url: string }

export const BIRMINGHAM_CONFERENCE_ARTWORKS: BirminghamConferenceArtwork[] = ARTWORKS.map(
  (artwork) => ({
    ...artwork,
    url: `https://${artwork.host}${artwork.path}`,
  })
)

export function matchBirminghamConferenceArtwork(
  message: string | null | undefined
): BirminghamConferenceArtwork | null {
  if (!message?.trim()) return null
  let url: URL
  try {
    url = new URL(message.trim())
  } catch {
    return null
  }
  const path = url.pathname.replace(/\/$/, "") || "/"
  return BIRMINGHAM_CONFERENCE_ARTWORKS.find(
    (artwork) => artwork.host === url.host && artwork.path === path
  ) ?? null
}

function birminghamCodeFromLog(log: PoiseLog): string | null {
  return canonicalBirminghamTagName(log.text_name) ?? canonicalBirminghamTagName(log.txt_message)
}

function birminghamLink(log: PoiseLog, fallback: string): string {
  const message = log.txt_message?.trim() ?? ""
  if (message.startsWith("/") || message.includes("://")) return message
  return fallback
}

export function birminghamGroup(log: PoiseLog): { title: string; path: string; url: string } | null {
  const code = birminghamCodeFromLog(log)
  if (code) {
    return { title: code, path: `/${code.toLowerCase()}`, url: birminghamLink(log, code) }
  }
  const artwork = matchBirminghamConferenceArtwork(log.txt_message)
  if (!artwork) return null
  return { title: artwork.dashboardTitle, path: artwork.path, url: artwork.url }
}

export function getBirminghamConferenceLogs(logs: PoiseLog[]): PoiseLog[] {
  return logs.filter((log) => birminghamGroup(log) !== null)
}

export function distinctBirminghamBdCodes(logs: PoiseLog[]): string[] {
  return [
    ...new Set(
      getBirminghamConferenceLogs(logs)
        .map((log) => birminghamCodeFromLog(log))
        .filter((code): code is string => code !== null)
    ),
  ].sort((a, b) => a.localeCompare(b))
}

export function countBirminghamTrackedItems(logs: PoiseLog[] = []): number {
  return 2 + distinctBirminghamBdCodes(logs).length
}

function redirects(logs: PoiseLog[]): PoiseLog[] {
  return getBirminghamConferenceLogs(logs).filter(
    (log) => (log.txt_message_type ?? "").trim().toUpperCase() === "REDIRECTED"
  )
}

function timestampMs(value: string | null | undefined): number {
  return gallery.parseLogTimestampGmt(value)?.getTime() ?? 0
}

export function birminghamSarFromLog(log: PoiseLog): string | null {
  const artwork = matchBirminghamConferenceArtwork(log.txt_message)
  const sar =
    artwork?.domainLabel === ".museum" ? museum.getSarFromLog(log) : gallery.getSarFromLog(log)
  return sar?.trim() || null
}

function seriesKey(log: PoiseLog): string | null {
  const group = birminghamGroup(log)
  if (!group) return null
  return birminghamSarFromLog(log) ?? group.title
}

export function buildBirminghamActivityEntries(logs: PoiseLog[]) {
  return redirects(logs)
    .map((log) => {
      const group = birminghamGroup(log)!
      return {
        key: `redirect-${log.int_id}`,
        redirect: log,
        seen: [] as PoiseLog[],
        timestamp: log.dtm_timestamp,
        artworkTitle: group.title,
        link: group.url,
      }
    })
    .sort((a, b) => timestampMs(b.timestamp) - timestampMs(a.timestamp))
}

export function buildBirminghamTrackedArtworkScanGroups(logs: PoiseLog[]) {
  const redirected = redirects(logs)
  const artworkGroups = BIRMINGHAM_CONFERENCE_ARTWORKS.map((artwork) => ({
    title: artwork.dashboardTitle,
    path: artwork.path,
    url: artwork.url,
    scans: redirected
      .filter((log) => birminghamGroup(log)?.title === artwork.dashboardTitle)
      .sort((a, b) => timestampMs(b.dtm_timestamp) - timestampMs(a.dtm_timestamp)),
  }))
  const bdGroups = distinctBirminghamBdCodes(redirected).map((code) => {
    const scans = redirected
      .filter((log) => birminghamCodeFromLog(log) === code)
      .sort((a, b) => timestampMs(b.dtm_timestamp) - timestampMs(a.dtm_timestamp))
    return {
      title: code,
      path: `/${code.toLowerCase()}`,
      url: birminghamGroup(scans[0])?.url ?? code,
      scans,
    }
  })
  return [...artworkGroups, ...bdGroups].sort((a, b) => b.scans.length - a.scans.length)
}

function percentChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

export function buildBirminghamOverviewAnalytics(logs: PoiseLog[]) {
  const scans = redirects(logs)
  const now = new Date()
  const weekStart = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000)
  const previousWeekStart = new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const counts = new Map<string, number>()
  for (const scan of scans) {
    const title = birminghamGroup(scan)?.title ?? "Unknown"
    counts.set(title, (counts.get(title) ?? 0) + 1)
  }
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1])
  const top = ranked[0] ?? ["-", 0]
  const inRange = (start: Date, end: Date | null) =>
    scans.filter((scan) => {
      const date = gallery.parseLogTimestampGmt(scan.dtm_timestamp)
      if (!date || date < start) return false
      return end ? date < end : true
    }).length
  const topTagThisMonth = scans.filter((scan) => {
    const date = gallery.parseLogTimestampGmt(scan.dtm_timestamp)
    const title = birminghamGroup(scan)?.title
    return date !== null && date >= monthStart && title === top[0]
  }).length
  const activeTags = ranked.length
  return {
    totalTaps: scans.length,
    activeTags,
    topTagName: top[0],
    topTagMonthCount: topTagThisMonth,
    avgPerTag: activeTags > 0 ? Math.round(scans.length / activeTags) : 0,
    weeklyChange: percentChange(inRange(weekStart, null), inRange(previousWeekStart, weekStart)),
  }
}

export function buildBirminghamAudienceAnalytics(logs: PoiseLog[]) {
  const base = gallery.buildAudienceAnalytics([])
  const hourlyCounts = Array.from({ length: 24 }, () => 0)
  const weekdayCounts = Array.from({ length: 7 }, () => 0)
  for (const scan of redirects(logs)) {
    const date = gallery.parseLogTimestampGmt(scan.dtm_timestamp)
    if (!date) continue
    hourlyCounts[date.getHours()] += 1
    const weekday = date.getDay()
    weekdayCounts[weekday === 0 ? 6 : weekday - 1] += 1
  }
  const hourlyMax = Math.max(...hourlyCounts, 1)
  const weekdayMax = Math.max(...weekdayCounts, 1)
  return {
    ...base,
    hourly: hourlyCounts.map((count, hour) => ({
      hour,
      count,
      intensity: count / hourlyMax,
    })),
    daily: weekdayCounts.map((count, weekday) => ({
      weekday,
      label: base.daily[weekday]?.label ?? "",
      count,
      intensity: count / weekdayMax,
    })),
    hasDeviceData: false,
  }
}

export function buildBirminghamWeeklySeries(logs: PoiseLog[], weekOffset: number) {
  return gallery.buildWeeklySeries(redirects(logs), weekOffset)
}

export function buildBirminghamMonthlyCalendarGrid(logs: PoiseLog[], monthOffset: number) {
  return gallery.buildMonthlyCalendarGrid(redirects(logs), monthOffset)
}

export function listBirminghamDistinctSars(logs: PoiseLog[]): string[] {
  return [...new Set(getBirminghamConferenceLogs(logs).map(seriesKey).filter((key) => key !== null))]
    .sort((a, b) => a.localeCompare(b))
}

export function buildBirminghamSarTimelineEvents(logs: PoiseLog[], sarQuery: string) {
  const target = sarQuery.trim().toLowerCase()
  if (!target) return []
  return buildBirminghamActivityEntries(logs).filter((entry) => {
    const key = entry.redirect ? seriesKey(entry.redirect) : null
    return key?.toLowerCase() === target
  })
}

export function buildBirminghamSarTimelineRowMetaMap(logs: PoiseLog[]) {
  const meta = new Map<string, gallery.SarTimelineRowMeta>()
  for (const log of getBirminghamConferenceLogs(logs)) {
    const sar = seriesKey(log)
    if (!sar || meta.has(sar)) continue
    meta.set(sar, { sar, visitorNumber: null, country: null, language: null })
  }
  return meta
}

export function buildBirminghamSarTimelinePlot(logs: PoiseLog[]): gallery.SarTimelinePlot | null {
  const now = new Date()
  const points: gallery.SarTimelinePlotPoint[] = []
  for (const log of redirects(logs)) {
    const group = birminghamGroup(log)
    const sar = seriesKey(log)
    const timestamp = gallery.parseLogTimestampGmt(log.dtm_timestamp)
    if (!group || !sar || !timestamp) continue
    points.push({
      logId: log.int_id,
      sar,
      timestamp,
      offsetMs: timestamp.getTime() - now.getTime(),
      messageType: (log.txt_message_type ?? "-").trim(),
      artworkTitle: group.title,
      link: group.url,
      isRedirect: true,
    })
  }
  if (points.length === 0) return null
  const maxAbs = points.reduce((max, point) => Math.max(max, Math.abs(point.offsetMs)), 0)
  const viewportHalfExtentMs = 60 * 60 * 1000
  const totalExtentMs = Math.max(viewportHalfExtentMs, Math.ceil(maxAbs * 1.05))
  const formatEdge = (date: Date) =>
    date.toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  return {
    sars: [...new Set(points.map((point) => point.sar))].sort((a, b) => a.localeCompare(b)),
    points: [...points].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
    now,
    totalExtentMs,
    viewportHalfExtentMs,
    pastEdgeLabel: formatEdge(new Date(now.getTime() - totalExtentMs)),
    futureEdgeLabel: formatEdge(new Date(now.getTime() + totalExtentMs)),
  }
}
