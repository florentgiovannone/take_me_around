import * as tmaDemo from "@tma/analytics-tma-demo"

export type PoiseLog = tmaDemo.PoiseLog
export type StoreDashboardScope = "waitburys" | "charles_peters"

type StorePrefix = "W" | "CP"

const PREFIX: Record<StoreDashboardScope, StorePrefix> = {
  waitburys: "W",
  charles_peters: "CP",
}

const MAX_SERIAL = 999_999
const SEEN_NEIGHBOR_MS = 5000

export type StoreActivityEntry = tmaDemo.TmaDemoActivityEntry

type StoreArtwork = {
  tagName: string
  title: string
  path: string
}

function padSerial(value: number) {
  return value < 1000 ? String(value).padStart(3, "0") : String(value)
}

function canonicalCode(prefix: StorePrefix, value: string | null | undefined): string | null {
  if (!value) return null
  const match = value
    .toUpperCase()
    .match(new RegExp(`(?:^|[^A-Z0-9])${prefix}(\\d{1,6})(?!\\d)`))
  if (!match) return null
  const serial = Number(match[1])
  if (!Number.isInteger(serial) || serial < 1 || serial > MAX_SERIAL) return null
  return `${prefix}${padSerial(serial)}`
}

function codeFromLog(prefix: StorePrefix, log: PoiseLog) {
  return canonicalCode(prefix, log.text_name) ?? canonicalCode(prefix, log.txt_message)
}

function messageType(log: PoiseLog) {
  return (log.txt_message_type ?? "").trim().toUpperCase()
}

function timestampMs(log: PoiseLog) {
  return tmaDemo.parseLogTimestampGmt(log.dtm_timestamp)?.getTime() ?? 0
}

function artworkFor(code: string): StoreArtwork {
  return { tagName: code, title: code, path: `/${code}` }
}

function linkFor(log: PoiseLog, code: string) {
  const message = log.txt_message?.trim() ?? ""
  if (message.startsWith("/") || message.includes("://")) return message
  return code
}

function createAnalytics(scope: StoreDashboardScope) {
  const prefix = PREFIX[scope]

  function matchingLogs(logs: PoiseLog[]) {
    return logs.filter((log) => codeFromLog(prefix, log) !== null)
  }

  function getLogs(logs: PoiseLog[]) {
    const matched = matchingLogs(logs)
    const included = new Set(matched.map((log) => log.int_id))
    const extras: PoiseLog[] = []

    for (const redirect of matched) {
      if (messageType(redirect) !== "REDIRECTED") continue
      const redirectMs = timestampMs(redirect)
      if (!redirectMs) continue
      const code = codeFromLog(prefix, redirect)
      if (!code) continue
      for (const neighbor of logs) {
        if (included.has(neighbor.int_id) || messageType(neighbor) !== "SEEN") continue
        if (codeFromLog(prefix, neighbor)) continue
        const neighborMs = timestampMs(neighbor)
        if (!neighborMs || Math.abs(neighborMs - redirectMs) > SEEN_NEIGHBOR_MS) continue
        included.add(neighbor.int_id)
        extras.push({ ...neighbor, text_name: code })
      }
    }

    return extras.length ? [...matched, ...extras] : matched
  }

  function getRedirectScans(logs: PoiseLog[]) {
    return getLogs(logs).filter((log) => messageType(log) === "REDIRECTED")
  }

  function buildActivityEntries(logs: PoiseLog[]): StoreActivityEntry[] {
    const rows = getLogs(logs)
    const groups = new Map<string, { redirects: PoiseLog[]; seen: PoiseLog[] }>()

    for (const log of rows) {
      const code = codeFromLog(prefix, log) ?? "Unknown"
      const bucket = `${code}|${log.txt_uid?.trim() || "anon"}|${(log.dtm_timestamp ?? "").slice(0, 19)}`
      const group = groups.get(bucket) ?? { redirects: [], seen: [] }
      if (messageType(log) === "REDIRECTED") group.redirects.push(log)
      else group.seen.push(log)
      groups.set(bucket, group)
    }

    return [...groups.values()]
      .map((group) => {
        const redirect = [...group.redirects].sort((a, b) => timestampMs(b) - timestampMs(a))[0] ?? null
        const seen = [...group.seen].sort((a, b) => timestampMs(b) - timestampMs(a))
        const primary = redirect ?? seen[0]
        const code = primary ? (codeFromLog(prefix, primary) ?? primary.text_name?.trim() ?? "-") : "-"
        return {
          key: redirect ? `redirect-${redirect.int_id}` : `seen-${seen[0]?.int_id ?? "unknown"}`,
          redirect,
          seen,
          timestamp: primary?.dtm_timestamp ?? null,
          artworkTitle: code,
          link: primary ? linkFor(primary, code) : "-",
        }
      })
      .sort((a, b) => timestampMs({ dtm_timestamp: b.timestamp } as PoiseLog) - timestampMs({ dtm_timestamp: a.timestamp } as PoiseLog))
  }

  function buildTrackedArtworkScanGroups(logs: PoiseLog[]) {
    const scansByCode = new Map<string, PoiseLog[]>()
    for (const scan of getRedirectScans(logs)) {
      const code = codeFromLog(prefix, scan)
      if (!code) continue
      scansByCode.set(code, [...(scansByCode.get(code) ?? []), scan])
    }

    return [...scansByCode.entries()]
      .map(([code, scans]) => {
        const ordered = [...scans].sort((a, b) => timestampMs(b) - timestampMs(a))
        const artwork = artworkFor(code)
        return {
          ...artwork,
          url: linkFor(ordered[0], code),
          scans: ordered,
        }
      })
      .sort((a, b) => b.scans.length - a.scans.length)
  }

  function buildOverviewAnalytics(logs: PoiseLog[]) {
    const scans = getRedirectScans(logs)
    const now = Date.now()
    const week = 7 * 24 * 60 * 60 * 1000
    const counts = new Map<string, number>()
    for (const scan of scans) {
      const code = codeFromLog(prefix, scan) ?? "Unknown"
      counts.set(code, (counts.get(code) ?? 0) + 1)
    }
    const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1])
    const top = ranked[0] ?? ["-", 0]
    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)
    const thisWeek = scans.filter((scan) => now - timestampMs(scan) <= week).length
    const previousWeek = scans.filter((scan) => {
      const age = now - timestampMs(scan)
      return age > week && age <= week * 2
    }).length
    const weeklyChange =
      previousWeek === 0 ? (thisWeek > 0 ? 100 : 0) : ((thisWeek - previousWeek) / previousWeek) * 100
    const topTagMonthCount = scans.filter(
      (scan) => timestampMs(scan) >= monthStart.getTime() && (codeFromLog(prefix, scan) ?? "Unknown") === top[0]
    ).length

    return {
      totalTaps: scans.length,
      activeTags: ranked.length,
      topTagName: top[0],
      topTagMonthCount,
      avgPerTag: ranked.length > 0 ? Math.round(scans.length / ranked.length) : 0,
      weeklyChange,
    }
  }

  function buildAudienceAnalytics(logs: PoiseLog[]) {
    const seen = getLogs(logs).filter((log) => messageType(log) === "SEEN")
    const scans = getRedirectScans(logs)
    const details = seen.map((log) => tmaDemo.buildActivityVisitDetails(log))
    const base = tmaDemo.buildAudienceAnalytics([])
    const deviceCounts = new Map(base.devices.map((row) => [row.kind, 0]))
    const browserCounts = new Map(base.browsers.map((row) => [row.kind, 0]))
    const languageCounts = new Map<string, number>()
    const osCounts = new Map<string, number>()

    for (const detail of details) {
      if (detail.device) deviceCounts.set(detail.device, (deviceCounts.get(detail.device) ?? 0) + 1)
      if (detail.browser) browserCounts.set(detail.browser, (browserCounts.get(detail.browser) ?? 0) + 1)
      if (detail.os) osCounts.set(detail.os, (osCounts.get(detail.os) ?? 0) + 1)
      if (detail.language) languageCounts.set(detail.language, (languageCounts.get(detail.language) ?? 0) + 1)
    }

    const hourly = base.hourly.map((row) => ({ ...row, count: 0, intensity: 0 }))
    const daily = base.daily.map((row) => ({ ...row, count: 0, intensity: 0 }))
    for (const scan of scans) {
      const date = tmaDemo.parseLogTimestampGmt(scan.dtm_timestamp)
      if (!date) continue
      hourly[date.getHours()].count += 1
      const weekday = date.getDay()
      const index = weekday === 0 ? 6 : weekday - 1
      daily[index].count += 1
    }
    const hourlyMax = Math.max(...hourly.map((row) => row.count), 1)
    const dailyMax = Math.max(...daily.map((row) => row.count), 1)
    const percent = (count: number, total: number) => (total > 0 ? Math.round((count / total) * 100) : 0)
    const deviceTotal = [...deviceCounts.values()].reduce((sum, count) => sum + count, 0)
    const browserTotal = [...browserCounts.values()].reduce((sum, count) => sum + count, 0)
    const osTotal = [...osCounts.values()].reduce((sum, count) => sum + count, 0)

    return {
      ...base,
      devices: base.devices.map((row) => ({
        ...row,
        count: deviceCounts.get(row.kind) ?? 0,
        percent: percent(deviceCounts.get(row.kind) ?? 0, deviceTotal),
      })),
      browsers: [...browserCounts.entries()]
        .filter(([, count]) => count > 0)
        .map(([kind, count]) => ({
          kind,
          count,
          percent: percent(count, browserTotal),
        })),
      hourly: hourly.map((row) => ({ ...row, intensity: row.count / hourlyMax })),
      daily: daily.map((row) => ({ ...row, intensity: row.count / dailyMax })),
      hasDeviceData: deviceTotal > 0,
      deviceInfo: [...osCounts.entries()].map(([label, count]) => ({
        label,
        count,
        percent: percent(count, osTotal),
      })),
      languages: [...languageCounts.entries()].map(([label, count]) => ({
        label,
        count,
        percent: percent(count, details.length),
      })),
      hasDeviceInfoData: osTotal > 0,
      hasLanguageData: languageCounts.size > 0,
    }
  }

  function listDistinctSars(logs: PoiseLog[]) {
    const values = new Set<string>()
    for (const log of getLogs(logs)) {
      const sar = tmaDemo.buildActivityVisitDetails(log).sar
      if (sar) values.add(sar)
    }
    return [...values].sort((a, b) => a.localeCompare(b))
  }

  function logsForSar(logs: PoiseLog[], sarQuery: string) {
    const target = sarQuery.trim().toLowerCase()
    if (!target) return []
    return getLogs(logs).filter(
      (log) => tmaDemo.buildActivityVisitDetails(log).sar?.toLowerCase() === target
    )
  }

  function buildSarTimelinePlot(logs: PoiseLog[]): tmaDemo.SarTimelinePlot | null {
    const now = new Date()
    const points: tmaDemo.SarTimelinePlot["points"] = []
    for (const log of getLogs(logs)) {
      const sar = tmaDemo.buildActivityVisitDetails(log).sar
      const timestamp = tmaDemo.parseLogTimestampGmt(log.dtm_timestamp)
      if (!sar || !timestamp) continue
      const code = codeFromLog(prefix, log) ?? log.text_name?.trim() ?? "Unknown"
      points.push({
        logId: log.int_id,
        sar,
        timestamp,
        offsetMs: timestamp.getTime() - now.getTime(),
        messageType: (log.txt_message_type ?? "-").trim(),
        artworkTitle: code,
        link: linkFor(log, code),
        isRedirect: messageType(log) === "REDIRECTED",
      })
    }
    if (points.length === 0) return null
    const maxAbs = points.reduce((max, point) => Math.max(max, Math.abs(point.offsetMs)), 0)
    const viewportHalfExtentMs = 60 * 60 * 1000
    const totalExtentMs = Math.max(viewportHalfExtentMs, Math.ceil(maxAbs * 1.05))
    const pastEdge = new Date(now.getTime() - totalExtentMs)
    const futureEdge = new Date(now.getTime() + totalExtentMs)
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
      pastEdgeLabel: formatEdge(pastEdge),
      futureEdgeLabel: formatEdge(futureEdge),
    }
  }

  function buildSarTimelineRowMetaMap(logs: PoiseLog[]) {
    const meta = new Map<string, tmaDemo.SarTimelineRowMeta>()
    for (const log of getLogs(logs)) {
      const details = tmaDemo.buildActivityVisitDetails(log)
      if (!details.sar || meta.has(details.sar)) continue
      meta.set(details.sar, {
        sar: details.sar,
        visitorNumber: null,
        country: null,
        language: details.language,
      })
    }
    return meta
  }

  return {
    scope,
    prefix,
    getLogs,
    buildActivityEntries,
    buildTrackedArtworkScanGroups,
    buildOverviewAnalytics,
    buildAudienceAnalytics,
    buildWeeklySeries(logs: PoiseLog[], weekOffset: number) {
      return tmaDemo.buildWeeklySeries(getRedirectScans(logs), weekOffset)
    },
    buildMonthlyCalendarGrid(logs: PoiseLog[], monthOffset: number) {
      return tmaDemo.buildMonthlyCalendarGrid(getRedirectScans(logs), monthOffset)
    },
    listDistinctSars,
    buildSarTimelineEvents(logs: PoiseLog[], sarQuery: string) {
      return buildActivityEntries(logsForSar(logs, sarQuery))
    },
    buildActivityVisitDetails: tmaDemo.buildActivityVisitDetails,
    buildSarTimelinePlot,
    buildSarTimelineRowMetaMap,
    getSarFromLog(log: PoiseLog) {
      return tmaDemo.buildActivityVisitDetails(log).sar
    },
    countCodes(logs: PoiseLog[]) {
      return new Set(
        getRedirectScans(logs)
          .map((log) => codeFromLog(prefix, log))
          .filter((code): code is string => Boolean(code))
      ).size
    },
  }
}

export const waitburys = createAnalytics("waitburys")
export const charlesPeters = createAnalytics("charles_peters")

export function storeAnalytics(scope: StoreDashboardScope) {
  return scope === "waitburys" ? waitburys : charlesPeters
}

export function isStoreCode(scope: StoreDashboardScope, value: string | null | undefined) {
  return canonicalCode(PREFIX[scope], value) !== null
}
