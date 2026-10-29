import { canonicalBirminghamTagName, type SiteScope } from "@tma/config"
import * as gallery from "@tma/analytics-gallery"
import * as museum from "@tma/analytics-museum"
import type { PoiseLog } from "@tma/analytics-gallery"

const ARTWORKS = [
  {
    slug: "the-star-of-betlehem",
    host: "takemearound.gallery",
    path: "/the-star-of-bethlehem",
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

export type BirminghamDashboardView = "public" | "admin"

export function birminghamViewForScope(scope: SiteScope): BirminghamDashboardView | null {
  if (scope === "birmingham_conference_admin") return "admin"
  if (scope === "birmingham_conference") return "public"
  return null
}

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
  const canonicalPath = path === "/the-star-of-betlehem" ? "/the-star-of-bethlehem" : path
  return BIRMINGHAM_CONFERENCE_ARTWORKS.find(
    (artwork) => artwork.host === url.host && artwork.path === canonicalPath
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

function artworkGroup(artwork: BirminghamConferenceArtwork) {
  return { title: artwork.dashboardTitle, path: artwork.path, url: artwork.url }
}

function artworkForTag(code: string): BirminghamConferenceArtwork | null {
  if (code.startsWith("MACTSOB")) return BIRMINGHAM_CONFERENCE_ARTWORKS[0] ?? null
  if (code.startsWith("MACTGB")) return BIRMINGHAM_CONFERENCE_ARTWORKS[1] ?? null
  return null
}

export function birminghamGroup(
  log: PoiseLog,
  view: BirminghamDashboardView = "public"
): { title: string; path: string; url: string } | null {
  const code = birminghamCodeFromLog(log)
  if (view === "admin") {
    if (!code) return null
    return { title: code, path: `/${code.toLowerCase()}`, url: birminghamLink(log, code) }
  }
  const taggedArtwork = code ? artworkForTag(code) : null
  if (taggedArtwork) return artworkGroup(taggedArtwork)
  const artwork = matchBirminghamConferenceArtwork(log.txt_message)
  if (!artwork) return null
  return artworkGroup(artwork)
}

function matchingLogs(logs: PoiseLog[], view: BirminghamDashboardView): PoiseLog[] {
  return logs.filter((log) => birminghamGroup(log, view) !== null)
}

export function getBirminghamConferenceLogs(
  logs: PoiseLog[],
  view: BirminghamDashboardView = "public"
): PoiseLog[] {
  const matched = matchingLogs(logs, view)
  const included = new Set(matched.map((log) => log.int_id))
  const extras: PoiseLog[] = []
  const pairs = pairSeenWithRedirects(logs, view)
  for (const redirect of redirects(logs, view)) {
    const seen = pairs.get(redirect.int_id)
    if (!seen || included.has(seen.int_id)) continue
    included.add(seen.int_id)
    const group = birminghamGroup(redirect, view)
    extras.push(seen.text_name?.trim() ? seen : { ...seen, text_name: group?.title ?? seen.text_name })
  }
  return extras.length ? [...matched, ...extras] : matched
}

export function distinctBirminghamBdCodes(logs: PoiseLog[]): string[] {
  return [
    ...new Set(
      logs
        .map((log) => birminghamCodeFromLog(log))
        .filter((code): code is string => code !== null)
    ),
  ].sort((a, b) => a.localeCompare(b))
}

export function countBirminghamTrackedItems(
  logs: PoiseLog[] = [],
  view: BirminghamDashboardView = "public"
): number {
  if (view === "public") return 2
  return distinctBirminghamBdCodes(getBirminghamConferenceLogs(logs, view)).length
}

const SEEN_PAIR_MS = 5000

function messageType(log: PoiseLog): string {
  return (log.txt_message_type ?? "").trim().toUpperCase()
}

function redirects(logs: PoiseLog[], view: BirminghamDashboardView): PoiseLog[] {
  return matchingLogs(logs, view).filter((log) => messageType(log) === "REDIRECTED")
}

function timestampMs(value: string | null | undefined): number {
  return gallery.parseLogTimestampGmt(value)?.getTime() ?? 0
}

function isSeenCookieLog(log: PoiseLog): boolean {
  return messageType(log) === "SEEN" && (log.txt_message ?? "").trim().startsWith("{")
}

function timestampsClose(left: PoiseLog, right: PoiseLog): boolean {
  const leftTime = timestampMs(left.dtm_timestamp)
  const rightTime = timestampMs(right.dtm_timestamp)
  if (!leftTime || !rightTime) return false
  return Math.abs(leftTime - rightTime) <= SEEN_PAIR_MS
}

function isPairableSeen(redirect: PoiseLog, seen: PoiseLog): boolean {
  if (!isSeenCookieLog(seen) || !timestampsClose(redirect, seen)) {
    return false
  }
  const redirectUid = redirect.txt_uid?.trim()
  const seenUid = seen.txt_uid?.trim()
  if (redirectUid && seenUid && redirectUid === seenUid) return true
  const redirectName = redirect.text_name?.trim().toLowerCase()
  const seenName = seen.text_name?.trim().toLowerCase()
  if (redirectName && seenName && redirectName === seenName) return true
  return !seenName && !seenUid
}

function seenNeighborForRedirect(
  redirect: PoiseLog,
  logs: PoiseLog[],
  used: Set<number>
): PoiseLog | null {
  const byId = new Map(logs.map((log) => [log.int_id, log]))
  for (const neighborId of [redirect.int_id - 1, redirect.int_id + 1]) {
    const neighbor = byId.get(neighborId)
    if (!neighbor || used.has(neighbor.int_id)) continue
    if (isPairableSeen(redirect, neighbor)) return neighbor
  }
  let best: PoiseLog | null = null
  let bestDelta = Infinity
  const redirectTime = timestampMs(redirect.dtm_timestamp)
  for (const neighbor of logs) {
    if (used.has(neighbor.int_id) || neighbor.int_id === redirect.int_id) continue
    if (!isPairableSeen(redirect, neighbor)) continue
    const delta = Math.abs(timestampMs(neighbor.dtm_timestamp) - redirectTime)
    if (delta < bestDelta) {
      best = neighbor
      bestDelta = delta
    }
  }
  return best
}

function pairSeenWithRedirects(
  logs: PoiseLog[],
  view: BirminghamDashboardView
): Map<number, PoiseLog> {
  const used = new Set<number>()
  const byRedirect = new Map<number, PoiseLog>()
  for (const redirect of redirects(logs, view)) {
    const seen = seenNeighborForRedirect(redirect, logs, used)
    if (!seen) continue
    used.add(seen.int_id)
    byRedirect.set(redirect.int_id, seen)
  }
  return byRedirect
}

export function birminghamSarFromLog(log: PoiseLog): string | null {
  const artwork =
    matchBirminghamConferenceArtwork(log.txt_message) ??
    artworkForTag(birminghamCodeFromLog(log) ?? "")
  const sar =
    artwork?.domainLabel === ".museum" ? museum.getSarFromLog(log) : gallery.getSarFromLog(log)
  return sar?.trim() || null
}

function sessionSar(log: PoiseLog, pairs: Map<number, PoiseLog>): string | null {
  const direct = birminghamSarFromLog(log)
  if (direct) return direct
  const seen = pairs.get(log.int_id)
  return seen ? birminghamSarFromLog(seen) : null
}

export function buildBirminghamActivityEntries(
  logs: PoiseLog[],
  view: BirminghamDashboardView = "public"
) {
  const pairs = pairSeenWithRedirects(logs, view)
  return redirects(logs, view)
    .map((log) => {
      const group = birminghamGroup(log, view)!
      const seen = pairs.get(log.int_id)
      return {
        key: `redirect-${log.int_id}`,
        redirect: log,
        seen: seen ? [seen] : [],
        timestamp: log.dtm_timestamp,
        artworkTitle: group.title,
        link: group.url,
      }
    })
    .sort((a, b) => timestampMs(b.timestamp) - timestampMs(a.timestamp))
}

export function buildBirminghamTrackedArtworkScanGroups(
  logs: PoiseLog[],
  view: BirminghamDashboardView = "public"
) {
  const redirected = redirects(logs, view)
  if (view === "admin") {
    return distinctBirminghamBdCodes(redirected).map((code) => {
      const scans = redirected
        .filter((log) => birminghamCodeFromLog(log) === code)
        .sort((a, b) => timestampMs(b.dtm_timestamp) - timestampMs(a.dtm_timestamp))
      return {
        title: code,
        path: `/${code.toLowerCase()}`,
        url: birminghamGroup(scans[0], view)?.url ?? code,
        scans,
      }
    })
  }
  return BIRMINGHAM_CONFERENCE_ARTWORKS.map((artwork) => ({
    title: artwork.dashboardTitle,
    path: artwork.path,
    url: artwork.url,
    scans: redirected
      .filter((log) => birminghamGroup(log, view)?.title === artwork.dashboardTitle)
      .sort((a, b) => timestampMs(b.dtm_timestamp) - timestampMs(a.dtm_timestamp)),
  })).sort((a, b) => b.scans.length - a.scans.length)
}

function percentChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

export function buildBirminghamOverviewAnalytics(
  logs: PoiseLog[],
  view: BirminghamDashboardView = "public"
) {
  const scans = redirects(logs, view)
  const now = new Date()
  const weekStart = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000)
  const previousWeekStart = new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const counts = new Map<string, number>()
  for (const scan of scans) {
    const title = birminghamGroup(scan, view)?.title ?? "Unknown"
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
    const title = birminghamGroup(scan, view)?.title
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

export function buildBirminghamAudienceAnalytics(
  logs: PoiseLog[],
  view: BirminghamDashboardView = "public"
) {
  const base = gallery.buildAudienceAnalytics([])
  const hourlyCounts = Array.from({ length: 24 }, () => 0)
  const weekdayCounts = Array.from({ length: 7 }, () => 0)
  for (const scan of redirects(logs, view)) {
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

export function buildBirminghamWeeklySeries(
  logs: PoiseLog[],
  weekOffset: number,
  view: BirminghamDashboardView = "public"
) {
  return gallery.buildWeeklySeries(redirects(logs, view), weekOffset)
}

export function buildBirminghamMonthlyCalendarGrid(
  logs: PoiseLog[],
  monthOffset: number,
  view: BirminghamDashboardView = "public"
) {
  return gallery.buildMonthlyCalendarGrid(redirects(logs, view), monthOffset)
}

export function listBirminghamDistinctSars(
  logs: PoiseLog[],
  view: BirminghamDashboardView = "public"
): string[] {
  const pairs = pairSeenWithRedirects(logs, view)
  return [...new Set(redirects(logs, view).map((log) => sessionSar(log, pairs)).filter((key) => key !== null))]
    .sort((a, b) => a.localeCompare(b))
}

export function buildBirminghamSarTimelineEvents(
  logs: PoiseLog[],
  sarQuery: string,
  view: BirminghamDashboardView = "public"
) {
  const target = sarQuery.trim().toLowerCase()
  if (!target) return []
  const pairs = pairSeenWithRedirects(logs, view)
  return buildBirminghamActivityEntries(logs, view).filter((entry) => {
    const key = entry.redirect ? sessionSar(entry.redirect, pairs) : null
    return key?.toLowerCase() === target
  })
}

export function buildBirminghamSarTimelineRowMetaMap(
  logs: PoiseLog[],
  view: BirminghamDashboardView = "public"
) {
  const meta = new Map<string, gallery.SarTimelineRowMeta>()
  const pairs = pairSeenWithRedirects(logs, view)
  for (const log of redirects(logs, view)) {
    const sar = sessionSar(log, pairs)
    if (!sar || meta.has(sar)) continue
    const seen = pairs.get(log.int_id)
    const details = gallery.buildActivityVisitDetails(seen ?? log)
    meta.set(sar, {
      sar,
      visitorNumber: seen?.visitor_number?.trim() || log.visitor_number?.trim() || null,
      country: null,
      language: details.language,
    })
  }
  return meta
}

export function buildBirminghamSarTimelinePlot(
  logs: PoiseLog[],
  view: BirminghamDashboardView = "public"
): gallery.SarTimelinePlot | null {
  const now = new Date()
  const points: gallery.SarTimelinePlotPoint[] = []
  const pairs = pairSeenWithRedirects(logs, view)
  for (const log of redirects(logs, view)) {
    const group = birminghamGroup(log, view)
    const sar = sessionSar(log, pairs)
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
