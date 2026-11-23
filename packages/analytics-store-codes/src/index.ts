import * as tmaDemo from "@tma/analytics-tma-demo"
import type { PoiseLog } from "@tma/analytics-tma-demo"
import type { StoreDashboardScope } from "@tma/config"

export type { StoreDashboardScope } from "@tma/config"

type CodeScope = Exclude<StoreDashboardScope, "i_am_a_safe_pet" | "frieze_gallery">
type StorePrefix = "W" | "CP" | "PV" | "CO" | "YF" | "SD"

const PREFIX: Record<CodeScope, StorePrefix> = {
  waitburys: "W",
  charles_peters: "CP",
  fair_future: "PV",
  choose_and_order: "CO",
  yesterday_forever: "YF",
  sevendials: "SD",
}

/** Longest first so FSFT and FSWIF are not read as a shorter prefix. */
const FRIEZE_GALLERY_TAG_PREFIXES = ["FSWIF", "FSFT", "FCI", "FO", "FD"] as const

const MAX_SERIAL = 999_999
const SEEN_NEIGHBOR_MS = 5000
const SLATE_MULTI_TAG_WINDOW_MS = 5000

export type StoreActivityEntry = tmaDemo.TmaDemoActivityEntry

export type StoreArtwork = {
  tagName?: string
  title: string
  path: string
}

function padSerial(value: number) {
  return value < 1000 ? String(value).padStart(3, "0") : String(value)
}

/** Choose and Order tags are named CAO001, CAO002, and so on. */
export function canonicalChooseAndOrderTagName(value: string | null | undefined): string | null {
  if (!value?.trim()) return null
  const trimmed = value.trim()
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) return null
  if (!trimmed.toUpperCase().startsWith("CAO")) return null
  const compact = trimmed.toUpperCase().replace(/[^A-Z0-9]/g, "")
  const match = compact.match(/^CAO(\d{1,6})$/)
  if (!match) return null
  const serial = Number(match[1])
  if (!Number.isInteger(serial) || serial < 1 || serial > MAX_SERIAL) return null
  return `CAO${padSerial(serial)}`
}

/** Yesterday Forever tags are named YF001, YF002, and so on. */
export function canonicalYesterdayForeverTagName(value: string | null | undefined): string | null {
  if (!value?.trim()) return null
  const trimmed = value.trim()
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) return null
  if (!trimmed.toUpperCase().startsWith("YF")) return null
  const compact = trimmed.toUpperCase().replace(/[^A-Z0-9]/g, "")
  const match = compact.match(/^YF(\d{1,6})$/)
  if (!match) return null
  const serial = Number(match[1])
  if (!Number.isInteger(serial) || serial < 1 || serial > MAX_SERIAL) return null
  return `YF${padSerial(serial)}`
}

/** Frieze Gallery tags are named FD001, FCI001, FO001, FSFT001, FSWIF001, and so on. */
export function canonicalFriezeGalleryTagName(value: string | null | undefined): string | null {
  if (!value?.trim()) return null
  const trimmed = value.trim()
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) return null
  const compact = trimmed.toUpperCase().replace(/[^A-Z0-9]/g, "")
  const prefix = FRIEZE_GALLERY_TAG_PREFIXES.find((item) => compact.startsWith(item))
  if (!prefix) return null
  const match = compact.match(new RegExp(`^${prefix}(\\d{1,6})$`))
  if (!match) return null
  const serial = Number(match[1])
  if (!Number.isInteger(serial) || serial < 1 || serial > MAX_SERIAL) return null
  return `${prefix}${padSerial(serial)}`
}

export const SEVEN_DIALS_KNOWN_CODES = ["SD001", "SD002"] as const

const SEVEN_DIALS_TITLES: Record<string, string> = {
  SD001: "SD001 — Charles Boon (1877–1943)",
  SD002: "SD002 — Brian Epstein (1934–1967)",
}

const SEVEN_DIALS_PATHS: Record<string, string> = {
  SD001: "/charles-boon",
  SD002: "/brian-epstein",
}

export function sevenDialsDisplayTitle(code: string): string {
  return SEVEN_DIALS_TITLES[code] ?? code
}

/** Seven Dials Trust tags (SD001, SD002, ...) or plaque slugs (/charles-boon, /brian-epstein). */
export function canonicalSevenDialsTagName(value: string | null | undefined): string | null {
  if (!value?.trim()) return null
  const trimmed = value.trim()
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) return null

  const lower = trimmed.toLowerCase()
  if (
    lower === "charles-boon" ||
    lower === "charles boon" ||
    /(^|\/)(peoples-plaques\/)?charles-boon(\/|$|\?)/i.test(trimmed)
  ) {
    return "SD001"
  }
  if (
    lower === "brian-epstein" ||
    lower === "brian epstein" ||
    /(^|\/)(peoples-plaques\/)?brian-epstein(\/|$|\?)/i.test(trimmed)
  ) {
    return "SD002"
  }

  const compact = trimmed.toUpperCase().replace(/[^A-Z0-9]/g, "")
  const match = compact.match(/^SD(\d{1,6})$/)
  if (!match) return null
  const serial = Number(match[1])
  if (!Number.isInteger(serial) || serial < 1 || serial > MAX_SERIAL) return null
  return `SD${padSerial(serial)}`
}

export function sevenDialsCode(log: {
  text_name?: string | null
  txt_message?: string | null
}): string | null {
  return (
    canonicalSevenDialsTagName(log.text_name) ??
    canonicalSevenDialsTagName(log.txt_message)
  )
}

/** Scans whose redirect lands on the mme-betty page. */
export function canonicalMmeBettyScan(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? ""
  if (!trimmed || trimmed.startsWith("{") || trimmed.startsWith("[")) return null
  try {
    const url = new URL(trimmed)
    const segments = decodeURIComponent(url.pathname).toLowerCase().split("/")
    if (segments.includes("mme-betty")) return "mme-betty"
  } catch {
    if (/(^|\/)mme-betty(\/|$|\?)/i.test(trimmed)) return "mme-betty"
  }
  return null
}

export function chooseAndOrderCode(log: {
  text_name?: string | null
  txt_message?: string | null
}): string | null {
  const fromName = canonicalChooseAndOrderTagName(log.text_name)
  if (fromName) return fromName
  if (!canonicalMmeBettyScan(log.txt_message)) {
    return log.text_name?.trim().toLowerCase() === "mme-betty" ? "mme-betty" : null
  }
  const name = log.text_name?.trim()
  if (name && !name.startsWith("{") && !name.startsWith("[")) return name
  return "mme-betty"
}

function canonicalCode(prefix: StorePrefix, value: string | null | undefined): string | null {
  if (!value?.trim()) return null
  const trimmed = value.trim()
  if (prefix === "CO") return canonicalChooseAndOrderTagName(trimmed)
  if (prefix === "YF") return canonicalYesterdayForeverTagName(trimmed)
  if (prefix === "SD") return canonicalSevenDialsTagName(trimmed)
  if (prefix === "PV") {
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) return null
    if (!trimmed.toUpperCase().startsWith("PV")) return null
    const compact = trimmed.toUpperCase().replace(/[^A-Z0-9]/g, "")
    const serialMatch = compact.match(/^PV(\d{1,6})$/)
    if (!serialMatch) return null
    const serial = Number(serialMatch[1])
    if (!Number.isInteger(serial) || serial < 1 || serial > MAX_SERIAL) return null
    return `PV${padSerial(serial)}`
  }

  const match = trimmed
    .toUpperCase()
    .match(new RegExp(`(?:^|[^A-Z0-9])${prefix}(\\d{1,6})(?!\\d)`))
  if (!match) return null
  const serial = Number(match[1])
  if (!Number.isInteger(serial) || serial < 1 || serial > MAX_SERIAL) return null
  return `${prefix}${padSerial(serial)}`
}

/** Tag names that start with "Pet Tag", such as "Pet Tag 1". */
export function canonicalPetTagName(value: string | null | undefined): string | null {
  if (!value?.trim()) return null
  const trimmed = value.trim()
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) return null
  const match = /^pet tag(?![a-z0-9])/i.exec(trimmed)
  if (!match) return null
  return `Pet Tag${trimmed.slice(match[0].length)}`
}

function messageType(log: PoiseLog) {
  return (log.txt_message_type ?? "").trim().toUpperCase()
}

function timestampMs(log: PoiseLog) {
  return tmaDemo.parseLogTimestampGmt(log.dtm_timestamp)?.getTime() ?? 0
}

function normalizeLogTimestampKey(value: string | null | undefined) {
  const date = tmaDemo.parseLogTimestampGmt(value)
  if (date) return String(Math.floor(date.getTime() / 1000))
  return value?.trim() ?? ""
}

function artworkFor(code: string, prefix?: StorePrefix | null): StoreArtwork {
  if (prefix === "SD") {
    return {
      tagName: code,
      title: sevenDialsDisplayTitle(code),
      path: SEVEN_DIALS_PATHS[code] ?? `/${code}`,
    }
  }
  return { tagName: code, title: code, path: `/${code}` }
}

const PV_CARD_REDIRECT = "https://poise.vote"

/** Card redirect for PV tags. Scan logs sometimes store a tracking URL instead. */
function publicPvLink(message: string) {
  if (!/^https?:\/\//i.test(message)) return PV_CARD_REDIRECT
  try {
    const url = new URL(message)
    if (
      url.hostname === "poise.vote" ||
      url.hostname === "www.poise.vote" ||
      url.hostname === "requestabet.abeta.co.uk"
    ) {
      return PV_CARD_REDIRECT
    }
    return `${url.origin}${url.pathname}`
  } catch {
    return PV_CARD_REDIRECT
  }
}

function linkFor(log: PoiseLog, code: string, prefix?: StorePrefix | null) {
  const message = log.txt_message?.trim() ?? ""
  if (prefix === "PV") return publicPvLink(message)
  if (message.startsWith("/") || message.includes("://")) return message
  if (prefix === "SD" && SEVEN_DIALS_PATHS[code]) return SEVEN_DIALS_PATHS[code]
  return code
}

function getAcceptLanguageHeaderFromLog(log: PoiseLog): string | null {
  const raw = log.txt_message?.trim()
  if (!raw?.startsWith("{")) return null
  try {
    const payload = JSON.parse(raw) as {
      HTTP_ACCEPT_LANGUAGE?: string
      ACCEPT_LANGUAGE?: string
      accept_language?: string
    }
    return (
      payload.HTTP_ACCEPT_LANGUAGE?.trim() ||
      payload.ACCEPT_LANGUAGE?.trim() ||
      payload.accept_language?.trim() ||
      null
    )
  } catch {
    return null
  }
}

function createAnalytics(scope: StoreDashboardScope) {
  const prefix: StorePrefix | null =
    scope === "i_am_a_safe_pet" || scope === "frieze_gallery" ? null : PREFIX[scope]

  function codeFromLog(log: PoiseLog) {
    if (scope === "frieze_gallery") return canonicalFriezeGalleryTagName(log.text_name)
    if (prefix === null) return canonicalPetTagName(log.text_name)
    if (prefix === "CO") return chooseAndOrderCode(log)
    if (prefix === "SD") return sevenDialsCode(log)
    if (prefix === "PV" || prefix === "YF") return canonicalCode(prefix, log.text_name)
    return canonicalCode(prefix, log.text_name) ?? canonicalCode(prefix, log.txt_message)
  }

  function matchingLogs(logs: PoiseLog[]) {
    return logs.filter((log) => codeFromLog(log) !== null)
  }

  function timestampsClose(left: PoiseLog, right: PoiseLog, maxMs = SEEN_NEIGHBOR_MS): boolean {
    const leftMs = timestampMs(left)
    const rightMs = timestampMs(right)
    if (!leftMs || !rightMs) return false
    return Math.abs(leftMs - rightMs) <= maxMs
  }

  /**
   * Each physical slate can have 4 NFC tags on it, all programmed with the same
   * text_name (code) but distinct hardware txt_uids. When a single tap triggers
   * multiple tags on the same slate within the tap window, collapse them so the
   * 4 tags on the slate behave as one.
   */
  function collapseSlateRedirects(rawRedirects: PoiseLog[]): PoiseLog[] {
    const chronological = [...rawRedirects].sort((a, b) => {
      const diff = timestampMs(a) - timestampMs(b)
      if (diff !== 0) return diff
      return a.int_id - b.int_id
    })

    const lastKeptByCode = new Map<string, PoiseLog>()
    const keptIds = new Set<number>()

    for (const redirect of chronological) {
      const code = codeFromLog(redirect)
      if (!code) continue
      const prev = lastKeptByCode.get(code)
      if (prev) {
        const prevUid = prev.txt_uid?.trim() || null
        const currUid = redirect.txt_uid?.trim() || null
        const sameSecond =
          Boolean(prev.dtm_timestamp && redirect.dtm_timestamp) &&
          normalizeLogTimestampKey(prev.dtm_timestamp) ===
            normalizeLogTimestampKey(redirect.dtm_timestamp)
        const multiTagTapWithinWindow =
          prevUid !== null &&
          currUid !== null &&
          prevUid !== currUid &&
          timestampsClose(prev, redirect, SLATE_MULTI_TAG_WINDOW_MS)

        if ((sameSecond && prevUid !== null && currUid !== null) || multiTagTapWithinWindow) {
          continue
        }
      }
      lastKeptByCode.set(code, redirect)
      keptIds.add(redirect.int_id)
    }

    return rawRedirects.filter((row) => keptIds.has(row.int_id))
  }

  function isPairableSeen(redirect: PoiseLog, seen: PoiseLog): boolean {
    if (messageType(seen) !== "SEEN") return false
    if (!timestampsClose(redirect, seen, SEEN_NEIGHBOR_MS)) return false

    const redirectCode = codeFromLog(redirect)
    const seenCode = codeFromLog(seen)
    if (redirectCode && seenCode) {
      return redirectCode === seenCode
    }

    const redirectUid = redirect.txt_uid?.trim()
    const seenUid = seen.txt_uid?.trim()
    if (redirectUid && seenUid && redirectUid === seenUid) return true

    const redirectName = redirect.text_name?.trim().toLowerCase()
    const seenName = seen.text_name?.trim().toLowerCase()
    if (redirectName && seenName && redirectName === seenName) return true

    return !seenName && !seenCode
  }

  function seenNeighborForRedirect(
    redirect: PoiseLog,
    allLogs: PoiseLog[],
    byId: Map<number, PoiseLog>,
    usedSeenIds: Set<number>
  ): PoiseLog | null {
    for (const neighborId of [redirect.int_id - 1, redirect.int_id + 1]) {
      const neighbor = byId.get(neighborId)
      if (!neighbor || usedSeenIds.has(neighbor.int_id)) continue
      if (isPairableSeen(redirect, neighbor)) return neighbor
    }

    let best: PoiseLog | null = null
    let bestDelta = Infinity
    const redirectTime = timestampMs(redirect)
    for (const candidate of allLogs) {
      if (usedSeenIds.has(candidate.int_id) || candidate.int_id === redirect.int_id) continue
      if (!isPairableSeen(redirect, candidate)) continue
      const delta = Math.abs(timestampMs(candidate) - redirectTime)
      if (delta < bestDelta) {
        best = candidate
        bestDelta = delta
      }
    }
    return best
  }

  function getRedirectScans(logs: PoiseLog[]): PoiseLog[] {
    const rawRedirects = matchingLogs(logs).filter((log) => messageType(log) === "REDIRECTED")
    return collapseSlateRedirects(rawRedirects)
  }

  function pairSeenWithRedirects(logs: PoiseLog[]): Map<number, PoiseLog> {
    const redirects = getRedirectScans(logs)
    const byId = new Map(logs.map((log) => [log.int_id, log]))
    const usedSeenIds = new Set<number>()
    const pairs = new Map<number, PoiseLog>()

    for (const redirect of redirects) {
      const seen = seenNeighborForRedirect(redirect, logs, byId, usedSeenIds)
      if (!seen) continue
      usedSeenIds.add(seen.int_id)
      pairs.set(redirect.int_id, seen)
    }

    return pairs
  }

  function getLogs(logs: PoiseLog[]): PoiseLog[] {
    const redirects = getRedirectScans(logs)
    const pairs = pairSeenWithRedirects(logs)
    const included = new Set<number>()
    const result: PoiseLog[] = []

    for (const redirect of redirects) {
      if (!included.has(redirect.int_id)) {
        included.add(redirect.int_id)
        result.push(redirect)
      }
      const seen = pairs.get(redirect.int_id)
      if (seen && !included.has(seen.int_id)) {
        included.add(seen.int_id)
        const code = codeFromLog(redirect)
        result.push(seen.text_name?.trim() || !code ? seen : { ...seen, text_name: code })
      }
    }

    for (const log of matchingLogs(logs)) {
      if (messageType(log) !== "SEEN" || included.has(log.int_id)) continue
      included.add(log.int_id)
      result.push(log)
    }

    return result
  }

  function buildActivityEntries(logs: PoiseLog[]): StoreActivityEntry[] {
    const redirects = getRedirectScans(logs)
    const pairs = pairSeenWithRedirects(logs)
    const pairedSeenIds = new Set<number>(
      [...pairs.values()].map((seen) => seen.int_id)
    )

    const entries: StoreActivityEntry[] = redirects.map((redirect) => {
      const seen = pairs.get(redirect.int_id)
      const code = codeFromLog(redirect) ?? redirect.text_name?.trim() ?? "-"
      const displayTitle = prefix === "SD" ? sevenDialsDisplayTitle(code) : code
      return {
        key: `redirect-${redirect.int_id}`,
        redirect,
        seen: seen ? [seen] : [],
        timestamp: redirect.dtm_timestamp ?? null,
        artworkTitle: displayTitle,
        link: linkFor(redirect, code, prefix),
      }
    })

    const orphanSeenGroups = new Map<string, PoiseLog[]>()
    for (const log of matchingLogs(logs)) {
      if (messageType(log) !== "SEEN" || pairedSeenIds.has(log.int_id)) continue
      const code = codeFromLog(log) ?? "Unknown"
      const key = `${code}|${normalizeLogTimestampKey(log.dtm_timestamp)}`
      orphanSeenGroups.set(key, [...(orphanSeenGroups.get(key) ?? []), log])
    }

    for (const seenGroup of orphanSeenGroups.values()) {
      const seen = [...seenGroup].sort((a, b) => timestampMs(b) - timestampMs(a))
      const primary = seen[0]
      if (!primary) continue
      const code = codeFromLog(primary) ?? primary.text_name?.trim() ?? "-"
      const displayTitle = prefix === "SD" ? sevenDialsDisplayTitle(code) : code
      entries.push({
        key: `seen-${primary.int_id}`,
        redirect: null,
        seen,
        timestamp: primary.dtm_timestamp ?? null,
        artworkTitle: displayTitle,
        link: linkFor(primary, code, prefix),
      })
    }

    return entries.sort(
      (a, b) =>
        timestampMs({ dtm_timestamp: b.timestamp } as PoiseLog) -
        timestampMs({ dtm_timestamp: a.timestamp } as PoiseLog)
    )
  }

  function buildTrackedArtworkScanGroups(logs: PoiseLog[]) {
    const scansByCode = new Map<string, PoiseLog[]>()
    if (prefix === "SD") {
      for (const code of SEVEN_DIALS_KNOWN_CODES) {
        scansByCode.set(code, [])
      }
    }
    for (const scan of getRedirectScans(logs)) {
      const code = codeFromLog(scan)
      if (!code) continue
      scansByCode.set(code, [...(scansByCode.get(code) ?? []), scan])
    }

    return [...scansByCode.entries()]
      .map(([code, scans]) => {
        const ordered = [...scans].sort((a, b) => timestampMs(b) - timestampMs(a))
        const artwork = artworkFor(code, prefix)
        return {
          ...artwork,
          url: ordered[0] ? linkFor(ordered[0], code, prefix) : artwork.path,
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
      const code = codeFromLog(scan) ?? "Unknown"
      const label = prefix === "SD" ? sevenDialsDisplayTitle(code) : code
      counts.set(label, (counts.get(label) ?? 0) + 1)
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
      (scan) => {
        const code = codeFromLog(scan) ?? "Unknown"
        const label = prefix === "SD" ? sevenDialsDisplayTitle(code) : code
        return timestampMs(scan) >= monthStart.getTime() && label === top[0]
      }
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
    const languageTotal = [...languageCounts.values()].reduce((sum, count) => sum + count, 0)

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
        percent: percent(count, languageTotal),
      })),
      hasDeviceInfoData: osTotal > 0,
      hasLanguageData: languageCounts.size > 0,
    }
  }

  function resolveSarForLog(
    log: PoiseLog,
    pairs: Map<number, PoiseLog>,
    sarByUid: Map<string, string>,
    sarByCodeSecond: Map<string, string>
  ): string | null {
    const direct = tmaDemo.buildActivityVisitDetails(log).sar?.trim()
    if (direct) return direct

    const pairedSeen = pairs.get(log.int_id)
    if (pairedSeen) {
      const fromPair = tmaDemo.buildActivityVisitDetails(pairedSeen).sar?.trim()
      if (fromPair) return fromPair
    }

    const uid = log.txt_uid?.trim()
    if (uid) {
      const fromUid = sarByUid.get(uid)
      if (fromUid) return fromUid
    }

    const code = codeFromLog(log)
    if (code) {
      const key = `${code}|${normalizeLogTimestampKey(log.dtm_timestamp)}`
      const fromCodeSecond = sarByCodeSecond.get(key)
      if (fromCodeSecond) return fromCodeSecond
    }

    return null
  }

  function buildSarContext(logs: PoiseLog[]) {
    const pairs = pairSeenWithRedirects(logs)
    const sarByUid = new Map<string, string>()
    const sarByCodeSecond = new Map<string, string>()

    for (const log of getLogs(logs)) {
      if (messageType(log) !== "SEEN") continue
      const sar = tmaDemo.buildActivityVisitDetails(log).sar?.trim()
      if (!sar) continue
      const uid = log.txt_uid?.trim()
      if (uid) sarByUid.set(uid, sar)
      const code = codeFromLog(log)
      if (code) {
        const key = `${code}|${normalizeLogTimestampKey(log.dtm_timestamp)}`
        if (!sarByCodeSecond.has(key)) sarByCodeSecond.set(key, sar)
      }
    }

    for (const [redirectId, seen] of pairs.entries()) {
      const sar = tmaDemo.buildActivityVisitDetails(seen).sar?.trim()
      if (!sar) continue
      const redirect = logs.find((item) => item.int_id === redirectId)
      if (!redirect) continue
      const uid = redirect.txt_uid?.trim()
      if (uid && !sarByUid.has(uid)) sarByUid.set(uid, sar)
      const code = codeFromLog(redirect)
      if (code) {
        const key = `${code}|${normalizeLogTimestampKey(redirect.dtm_timestamp)}`
        if (!sarByCodeSecond.has(key)) sarByCodeSecond.set(key, sar)
      }
    }

    return { pairs, sarByUid, sarByCodeSecond }
  }

  function listDistinctSars(logs: PoiseLog[]) {
    const { pairs, sarByUid, sarByCodeSecond } = buildSarContext(logs)
    const values = new Set<string>()
    for (const log of getLogs(logs)) {
      const sar = resolveSarForLog(log, pairs, sarByUid, sarByCodeSecond)
      if (sar) values.add(sar)
    }
    return [...values].sort((a, b) => a.localeCompare(b))
  }

  function logsForSar(logs: PoiseLog[], sarQuery: string) {
    const target = sarQuery.trim().toLowerCase()
    if (!target) return []
    const { pairs, sarByUid, sarByCodeSecond } = buildSarContext(logs)
    return getLogs(logs).filter(
      (log) => resolveSarForLog(log, pairs, sarByUid, sarByCodeSecond)?.toLowerCase() === target
    )
  }

  function buildSarTimelinePlot(logs: PoiseLog[]): tmaDemo.SarTimelinePlot | null {
    const { pairs, sarByUid, sarByCodeSecond } = buildSarContext(logs)
    const now = new Date()
    const points: tmaDemo.SarTimelinePlot["points"] = []
    for (const log of getLogs(logs)) {
      const sar = resolveSarForLog(log, pairs, sarByUid, sarByCodeSecond)
      const timestamp = tmaDemo.parseLogTimestampGmt(log.dtm_timestamp)
      if (!sar || !timestamp) continue
      const code = codeFromLog(log) ?? log.text_name?.trim() ?? "Unknown"
      const displayTitle = prefix === "SD" ? sevenDialsDisplayTitle(code) : code
      points.push({
        logId: log.int_id,
        sar,
        timestamp,
        offsetMs: timestamp.getTime() - now.getTime(),
        messageType: (log.txt_message_type ?? "-").trim(),
        artworkTitle: displayTitle,
        link: linkFor(log, code, prefix),
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
    const { pairs, sarByUid, sarByCodeSecond } = buildSarContext(logs)
    const meta = new Map<string, tmaDemo.SarTimelineRowMeta>()
    const scopedLogs = getLogs(logs)

    for (const log of scopedLogs) {
      const sar = resolveSarForLog(log, pairs, sarByUid, sarByCodeSecond)
      if (!sar || meta.has(sar)) continue
      const seenSource =
        messageType(log) === "SEEN" ? log : (pairs.get(log.int_id) ?? log)
      const details = tmaDemo.buildActivityVisitDetails(seenSource)
      const acceptLanguage = getAcceptLanguageHeaderFromLog(seenSource)
      meta.set(sar, {
        sar,
        visitorNumber: seenSource.visitor_number?.trim() || log.visitor_number?.trim() || null,
        country: tmaDemo.parseCountryFromAcceptLanguage(acceptLanguage),
        language: tmaDemo.parseLanguageNameFromAcceptLanguage(acceptLanguage) ?? details.language,
      })
    }
    return meta
  }

  return {
    scope,
    prefix: scope === "frieze_gallery" ? "FD" : (prefix ?? "Pet Tag"),
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
      const codes = new Set<string>(
        prefix === "SD" ? SEVEN_DIALS_KNOWN_CODES : []
      )
      for (const log of getRedirectScans(logs)) {
        const code = codeFromLog(log)
        if (code) codes.add(code)
      }
      return codes.size
    },
  }
}

export const waitburys = createAnalytics("waitburys")
export const charlesPeters = createAnalytics("charles_peters")
export const fairFuture = createAnalytics("fair_future")
export const safePet = createAnalytics("i_am_a_safe_pet")
export const chooseAndOrder = createAnalytics("choose_and_order")
export const yesterdayForever = createAnalytics("yesterday_forever")
export const friezeGallery = createAnalytics("frieze_gallery")
export const sevendials = createAnalytics("sevendials")

const ANALYTICS = {
  waitburys,
  charles_peters: charlesPeters,
  fair_future: fairFuture,
  i_am_a_safe_pet: safePet,
  choose_and_order: chooseAndOrder,
  yesterday_forever: yesterdayForever,
  frieze_gallery: friezeGallery,
  sevendials,
} as const

export function storeAnalytics(scope: StoreDashboardScope) {
  return ANALYTICS[scope]
}

export function isStoreCode(scope: StoreDashboardScope, value: string | null | undefined) {
  if (scope === "i_am_a_safe_pet") return canonicalPetTagName(value) !== null
  if (scope === "frieze_gallery") return canonicalFriezeGalleryTagName(value) !== null
  return canonicalCode(PREFIX[scope], value) !== null
}
