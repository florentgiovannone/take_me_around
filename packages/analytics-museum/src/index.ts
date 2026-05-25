export type PoiseLog = {
  int_id: number
  dtm_timestamp: string | null
  txt_uid: string | null
  text_name: string | null
  txt_message_type: string | null
  txt_message: string | null
}

export type DeviceKind = "mobile" | "desktop" | "tablet"
export type BrowserKind = "Chrome" | "Safari" | "Firefox" | "Edge" | "Other"
export type OperatingSystemKind =
  | "iOS"
  | "Android"
  | "Windows"
  | "macOS"
  | "Chrome OS"
  | "Linux"
  | "Windows Phone"
  | "Other"

type SeenPayload = {
  REMOTE_ADDR?: string
  HTTP_USER_AGENT?: string
  HTTP_ACCEPT_LANGUAGE?: string
  HTTP_COOKIE?: string
  ACCEPT_LANGUAGE?: string
  accept_language?: string
}

type ParsedSeen = {
  userAgent: string
  acceptLanguage: string | null
  timestamp: Date | null
  textName: string | null
}

export type AudienceBreakdownRow = {
  label: string
  count: number
  percent: number
}

export const TRACKED_MUSEUM_ARTWORKS = [
  { title: "The Cyrus Cylinder", path: "/the-cyrus-cylinder" },
  { title: "The Lewis Chessmen", path: "/the-lewis-chessmen" },
  { title: "The Rosetta Stone", path: "/the-rosetta-stone" },
  { title: "The Sutton Hoo helmet", path: "/the-sutton-hoo-helmet" },
  { title: "The Royal Game of Ur", path: "/the-royal-game-of-ur" },
  { title: "Hoa Hakananaiʻa", path: "/hoa-hakananai-a" },
] as const

export type TrackedArtwork = (typeof TRACKED_MUSEUM_ARTWORKS)[number]

const TRACKED_MUSEUM_PATHS = TRACKED_MUSEUM_ARTWORKS.map((artwork) => artwork.path)
const TRACKED_MUSEUM_PATHS_BY_LENGTH = [...TRACKED_MUSEUM_PATHS].sort(
  (a, b) => b.length - a.length
)
const TRACKED_MUSEUM_TITLES = new Set(
  TRACKED_MUSEUM_ARTWORKS.map((artwork) => artwork.title.toLowerCase())
)

/** Legacy URL variants that should roll up to a canonical tracked path. */
const TRACKED_MUSEUM_PATH_ALIASES: { match: string; canonical: string }[] = [
  { match: "/hoa-hakananai", canonical: "/hoa-hakananai-a" },
]

export function getTrackedArtworkUrl(path: string) {
  return `https://takemearound.museum${path}`
}

/** Reject .gallery and other hosts; allow path-only redirect messages and SEEN JSON payloads. */
function isMuseumDomainMessage(message: string) {
  const normalized = message.toLowerCase()
  if (normalized.includes("takemearound.gallery")) return false
  if (normalized.includes("http") && !normalized.includes("takemearound.museum")) {
    return false
  }
  return true
}

export function extractTrackedPathFromMessage(message: string): string | null {
  if (!isMuseumDomainMessage(message)) return null

  const normalized = message.toLowerCase()

  for (const path of TRACKED_MUSEUM_PATHS_BY_LENGTH) {
    if (normalized.includes(path)) return path
  }

  for (const alias of TRACKED_MUSEUM_PATH_ALIASES) {
    if (normalized.includes(alias.match)) return alias.canonical
  }

  return null
}

function nameMatchesTrackedMuseumArtwork(name: string | null | undefined) {
  const normalized = name?.trim().toLowerCase()
  return Boolean(normalized && TRACKED_MUSEUM_TITLES.has(normalized))
}

export function resolveTrackedArtwork(log: PoiseLog): TrackedArtwork | null {
  const path = extractTrackedPathFromMessage(log.txt_message ?? "")
  if (path) {
    return TRACKED_MUSEUM_ARTWORKS.find((artwork) => artwork.path === path) ?? null
  }

  const normalizedName = log.text_name?.trim().toLowerCase()
  if (!normalizedName) return null

  return (
    TRACKED_MUSEUM_ARTWORKS.find((artwork) => artwork.title.toLowerCase() === normalizedName) ??
    null
  )
}

/** True when the log belongs to one of the tracked takemearound.museum artworks. */
export function isMuseumLog(log: PoiseLog) {
  return resolveTrackedArtwork(log) !== null
}

export function getMuseumLogLink(log: PoiseLog) {
  const artwork = resolveTrackedArtwork(log)
  if (artwork) return getTrackedArtworkUrl(artwork.path)
  return log.txt_message?.trim() || "-"
}

export function getMuseumLogs(logs: PoiseLog[]) {
  return logs.filter(isMuseumLog)
}

export function getRedirectScans(logs: PoiseLog[]) {
  return logs.filter(
    (row) =>
      row.txt_message_type === "REDIRECTED" &&
      extractTrackedPathFromMessage(row.txt_message ?? "") !== null
  )
}

export type TrackedArtworkScanGroup = TrackedArtwork & {
  url: string
  scans: PoiseLog[]
}

export type MuseumActivityEntry = {
  key: string
  redirect: PoiseLog | null
  seen: PoiseLog[]
  timestamp: string | null
  artworkTitle: string
  link: string
}

function getArtworkKey(log: PoiseLog) {
  const artwork = resolveTrackedArtwork(log)
  if (artwork) return artwork.path

  const path = extractTrackedPathFromMessage(log.txt_message ?? "")
  if (path) return path

  return log.text_name?.trim().toLowerCase() ?? ""
}

function normalizeMessageType(value: string | null | undefined) {
  return (value ?? "").trim().toUpperCase()
}

function normalizeLogTimestampKey(value: string | null) {
  const date = parseTimestamp(value)
  if (date) return String(Math.floor(date.getTime() / 1000))
  return value?.trim() ?? ""
}

function getActivityGroupKey(log: PoiseLog) {
  return `${getArtworkKey(log)}|${normalizeLogTimestampKey(log.dtm_timestamp)}`
}

function findRedirectForSeen(seen: PoiseLog, redirects: PoiseLog[]) {
  const seenUid = seen.txt_uid?.trim()
  if (seenUid) {
    const byUid = redirects.find((redirect) => redirect.txt_uid?.trim() === seenUid)
    if (byUid) return byUid
  }

  const seenTimeKey = normalizeLogTimestampKey(seen.dtm_timestamp)
  const seenArtworkKey = getArtworkKey(seen)
  if (seenArtworkKey) {
    const byArtworkAndTime = redirects.find(
      (redirect) =>
        getArtworkKey(redirect) === seenArtworkKey &&
        normalizeLogTimestampKey(redirect.dtm_timestamp) === seenTimeKey
    )
    if (byArtworkAndTime) return byArtworkAndTime
  }

  const redirectsAtTime = redirects.filter(
    (redirect) => normalizeLogTimestampKey(redirect.dtm_timestamp) === seenTimeKey
  )
  if (redirectsAtTime.length === 1) return redirectsAtTime[0]

  return null
}

function sortLogsByTimestampDesc(a: PoiseLog, b: PoiseLog) {
  const aTime = parseLogTimestampGmt(a.dtm_timestamp)?.getTime() ?? 0
  const bTime = parseLogTimestampGmt(b.dtm_timestamp)?.getTime() ?? 0
  return bTime - aTime
}

export function buildMuseumActivityEntries(logs: PoiseLog[]): MuseumActivityEntry[] {
  const museumLogs = getMuseumLogs(logs)
  const redirects = museumLogs.filter(
    (row) => normalizeMessageType(row.txt_message_type) === "REDIRECTED"
  )
  const seenLogs = museumLogs.filter(
    (row) => normalizeMessageType(row.txt_message_type) === "SEEN"
  )
  const groups = new Map<string, { redirects: PoiseLog[]; seen: PoiseLog[] }>()

  for (const redirect of redirects) {
    const key = getActivityGroupKey(redirect)
    const group = groups.get(key) ?? { redirects: [], seen: [] }
    group.redirects.push(redirect)
    groups.set(key, group)
  }

  for (const seen of seenLogs) {
    const matchedRedirect = findRedirectForSeen(seen, redirects)
    const key = matchedRedirect ? getActivityGroupKey(matchedRedirect) : getActivityGroupKey(seen)
    const group = groups.get(key) ?? { redirects: [], seen: [] }
    group.seen.push(seen)
    groups.set(key, group)
  }

  const entries = Array.from(groups.values()).map((group) => {
    const redirect = [...group.redirects].sort(sortLogsByTimestampDesc)[0] ?? null
    const seen = [...group.seen].sort(sortLogsByTimestampDesc)
    const primary = redirect ?? seen[0]
    const artwork = primary ? resolveTrackedArtwork(primary) : null

    return {
      key: redirect ? `redirect-${redirect.int_id}` : `seen-${seen[0]?.int_id ?? "unknown"}`,
      redirect,
      seen,
      timestamp: primary?.dtm_timestamp ?? null,
      artworkTitle: artwork?.title ?? primary?.text_name?.trim() ?? "-",
      link: primary ? getMuseumLogLink(primary) : "-",
    }
  })

  return entries.sort((a, b) => {
    const aTime = parseLogTimestampGmt(a.timestamp)?.getTime() ?? 0
    const bTime = parseLogTimestampGmt(b.timestamp)?.getTime() ?? 0
    return bTime - aTime
  })
}

export function buildTrackedArtworkScanGroups(logs: PoiseLog[]): TrackedArtworkScanGroup[] {
  const scansByPath = new Map<string, PoiseLog[]>()

  for (const scan of getRedirectScans(logs)) {
    const path = extractTrackedPathFromMessage(scan.txt_message ?? "")
    if (!path) continue
    scansByPath.set(path, [...(scansByPath.get(path) ?? []), scan])
  }

  const sortByTimestampDesc = (a: PoiseLog, b: PoiseLog) => {
    const aTime = parseLogTimestampGmt(a.dtm_timestamp)?.getTime() ?? 0
    const bTime = parseLogTimestampGmt(b.dtm_timestamp)?.getTime() ?? 0
    return bTime - aTime
  }

  return TRACKED_MUSEUM_ARTWORKS.map((artwork) => ({
    ...artwork,
    url: getTrackedArtworkUrl(artwork.path),
    scans: (scansByPath.get(artwork.path) ?? []).sort(sortByTimestampDesc),
  })).sort((a, b) => b.scans.length - a.scans.length)
}

export function getSeenEntries(logs: PoiseLog[]) {
  return logs.filter((row) => row.txt_message_type === "SEEN")
}

const NAIVE_ISO_LOCAL = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{1,2}):(\d{2})(?::(\d{2}))?(?:\.(\d{1,9}))?$/
const CAL_DAY_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/

function hasExplicitTimezone(s: string) {
  return /[zZ]$|[+-]\d{2}:\d{2}$|[+-]\d{4}$/.test(s.trim())
}

/** Naive API timestamps interpreted as GMT/UTC (for Latest Scan and activity ordering). */
export function parseLogTimestampGmt(value: string | null | undefined): Date | null {
  if (value == null) return null
  const trimmed = String(value).trim()
  if (!trimmed) return null

  const dayOnly = CAL_DAY_ONLY.exec(trimmed)
  if (dayOnly && trimmed.length <= 12) {
    const y = Number(dayOnly[1])
    const mo = Number(dayOnly[2])
    const dom = Number(dayOnly[3])
    const d = new Date(Date.UTC(y, mo - 1, dom, 0, 0, 0, 0))
    return Number.isNaN(d.getTime()) ? null : d
  }

  if (!hasExplicitTimezone(trimmed)) {
    const m = NAIVE_ISO_LOCAL.exec(trimmed)
    if (m) {
      const hour = Number(m[4])
      const minute = Number(m[5])
      const sec = m[6] != null ? Number(m[6]) : 0
      if (
        Number.isFinite(hour) &&
        Number.isFinite(minute) &&
        Number.isFinite(sec) &&
        hour >= 0 &&
        hour < 24 &&
        minute >= 0 &&
        minute < 60 &&
        sec >= 0 &&
        sec < 60
      ) {
        const y = Number(m[1])
        const mo = Number(m[2])
        const dom = Number(m[3])
        const frac = m[7] != null ? `.${m[7]}` : ""
        const iso = `${y}-${String(mo).padStart(2, "0")}-${String(dom).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(sec).padStart(2, "0")}${frac}Z`
        const d = new Date(iso)
        if (!Number.isNaN(d.getTime())) return d
      }
    }
  }

  const parsed = new Date(trimmed)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function parseTimestamp(value: string | null) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function parseSeenEntry(log: PoiseLog): ParsedSeen | null {
  const raw = log.txt_message?.trim()
  if (!raw?.startsWith("{")) return null

  try {
    const payload = JSON.parse(raw) as SeenPayload
    const userAgent = payload.HTTP_USER_AGENT?.trim()
    if (!userAgent) return null

    const acceptLanguage =
      payload.HTTP_ACCEPT_LANGUAGE?.trim() ||
      payload.ACCEPT_LANGUAGE?.trim() ||
      payload.accept_language?.trim() ||
      null

    return {
      userAgent,
      acceptLanguage,
      timestamp: parseTimestamp(log.dtm_timestamp),
      textName: log.text_name,
    }
  } catch {
    return null
  }
}

export function getUserAgentFromLog(log: PoiseLog): string | null {
  return parseSeenEntry(log)?.userAgent ?? null
}

/** null when user agent is not available (e.g. REDIRECTED rows). */
export function isAndroidLog(log: PoiseLog): boolean | null {
  const userAgent = getUserAgentFromLog(log)
  if (!userAgent) return null
  return /android/i.test(userAgent)
}

export function formatAndroidField(log: PoiseLog): "Yes" | "No" | "—" {
  const android = isAndroidLog(log)
  if (android === null) return "—"
  return android ? "Yes" : "No"
}

export type ActivityVisitDetails = {
  visitId: number
  tagUid: string | null
  device: DeviceKind | null
  browser: BrowserKind | null
  os: OperatingSystemKind | null
  language: string | null
  android: "Yes" | "No" | null
  ipAddress: string | null
  sar: string | null
  userAgent: string | null
}

function parseSarFromCookie(cookieHeader: string | null | undefined) {
  if (!cookieHeader?.trim()) return null
  const match = cookieHeader.match(/(?:^|;\s*)sar=([^;]*)/i)
  return match?.[1]?.trim() || null
}

export function buildActivityVisitDetails(log: PoiseLog): ActivityVisitDetails {
  const raw = log.txt_message?.trim()
  let ipAddress: string | null = null
  let sar: string | null = null
  let userAgent = getUserAgentFromLog(log)
  let acceptLanguage: string | null = parseSeenEntry(log)?.acceptLanguage ?? null

  if (raw?.startsWith("{")) {
    try {
      const payload = JSON.parse(raw) as SeenPayload
      ipAddress = payload.REMOTE_ADDR?.trim() ?? null
      sar = parseSarFromCookie(payload.HTTP_COOKIE)
      userAgent = payload.HTTP_USER_AGENT?.trim() ?? userAgent
      acceptLanguage =
        payload.HTTP_ACCEPT_LANGUAGE?.trim() ||
        payload.ACCEPT_LANGUAGE?.trim() ||
        payload.accept_language?.trim() ||
        acceptLanguage
    } catch {
      // Keep parsed fallbacks when JSON is malformed.
    }
  }

  return {
    visitId: log.int_id,
    tagUid: log.txt_uid?.trim() ?? null,
    device: userAgent ? parseDevice(userAgent) : null,
    browser: userAgent ? parseBrowser(userAgent) : null,
    os: userAgent ? parseOperatingSystem(userAgent) : null,
    language: acceptLanguage ? parsePrimaryLanguage(acceptLanguage) : null,
    android: userAgent ? (isAndroidLog(log) ? "Yes" : "No") : null,
    ipAddress,
    sar,
    userAgent,
  }
}

function isAndroidUserAgent(userAgent: string) {
  if (/android/i.test(userAgent)) return true
  if (/dalvik|;\s*wv\)/i.test(userAgent)) return true
  if (
    /linux/i.test(userAgent) &&
    /mobile/i.test(userAgent) &&
    !/windows|macintosh|mac os x|iphone|ipad|ipod|cros/i.test(userAgent)
  ) {
    return true
  }
  return false
}

export function parseOperatingSystem(userAgent: string): OperatingSystemKind {
  if (/iphone|ipad|ipod/i.test(userAgent)) return "iOS"
  if (isAndroidUserAgent(userAgent)) return "Android"
  if (/windows phone/i.test(userAgent)) return "Windows Phone"
  if (/windows nt/i.test(userAgent)) return "Windows"
  if (/mac os x|macintosh/i.test(userAgent)) return "macOS"
  if (/cros/i.test(userAgent)) return "Chrome OS"
  if (/linux/i.test(userAgent)) return "Linux"
  return "Other"
}

const CANONICAL_LANGUAGE_LABELS: Record<string, string> = {
  en: "English",
  fr: "French",
  es: "Spanish",
}

export const FEATURED_LANGUAGES = ["English", "French", "Spanish"] as const

export function parseLanguageLabel(languageTag: string) {
  const tag = languageTag.trim()
  if (!tag || tag === "*") return "Unknown"

  const langCode = tag.split("-")[0]?.toLowerCase()
  if (!langCode) return tag

  const canonical = CANONICAL_LANGUAGE_LABELS[langCode]
  if (canonical) return canonical

  try {
    const languages = new Intl.DisplayNames(["en"], { type: "language" })
    const languageName = languages.of(langCode)
    if (!languageName) return tag

    const regionCode = tag.split("-")[1]?.toUpperCase()
    if (regionCode && regionCode.length === 2) {
      try {
        const regions = new Intl.DisplayNames(["en"], { type: "region" })
        const regionName = regions.of(regionCode)
        return regionName ? `${languageName} (${regionName})` : `${languageName} (${regionCode})`
      } catch {
        return `${languageName} (${regionCode})`
      }
    }

    return languageName
  } catch {
    return tag
  }
}

/** All languages listed in an Accept-Language header (deduped per visit). */
export function parseAcceptLanguages(acceptLanguage: string | null | undefined) {
  if (!acceptLanguage?.trim()) return ["Unknown"]

  const tags = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0]?.trim())
    .filter((part): part is string => Boolean(part) && part !== "*")

  if (tags.length === 0) return ["Unknown"]

  return [...new Set(tags.map(parseLanguageLabel))]
}

export function parsePrimaryLanguage(acceptLanguage: string | null | undefined) {
  return parseAcceptLanguages(acceptLanguage)[0] ?? "Unknown"
}

function buildBreakdownRows(counts: Map<string, number>): AudienceBreakdownRow[] {
  const total = Array.from(counts.values()).reduce((sum, count) => sum + count, 0)
  const toPercent = (count: number) => (total > 0 ? Math.round((count / total) * 100) : 0)

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({
      label,
      count,
      percent: toPercent(count),
    }))
}

export function parseDevice(userAgent: string): DeviceKind {
  if (/ipad|tablet|playbook|silk/i.test(userAgent)) return "tablet"
  if (/mobile|iphone|ipod|android.*mobile|blackberry|windows phone/i.test(userAgent)) {
    return "mobile"
  }
  return "desktop"
}

export function parseBrowser(userAgent: string): BrowserKind {
  if (/edg\//i.test(userAgent)) return "Edge"
  if (/firefox/i.test(userAgent)) return "Firefox"
  if (/chrome|crios|chromium/i.test(userAgent) && !/edg/i.test(userAgent)) return "Chrome"
  if (/safari/i.test(userAgent) && !/chrome|crios|chromium/i.test(userAgent)) return "Safari"
  return "Other"
}

function startOfDay(date: Date) {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function startOfWeekMonday(date: Date) {
  const copy = startOfDay(date)
  const weekday = copy.getDay()
  const daysFromMonday = weekday === 0 ? 6 : weekday - 1
  copy.setDate(copy.getDate() - daysFromMonday)
  return copy
}

function formatDayLabel(date: Date) {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
}

function formatWeekRange(start: Date, end: Date) {
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()
  const startLabel = start.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    ...(sameMonth ? {} : { year: "numeric" }),
  })
  const endLabel = end.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
  return `${startLabel} – ${endLabel}`
}

export type WeekTotal = {
  label: string
  count: number
  key: string
}

export function buildWeekTotalsFromSeries(series: TimeSeriesPoint[]): WeekTotal[] {
  const weekMap = new Map<string, { label: string; count: number; sortKey: number }>()

  for (const point of series) {
    if (point.isFuture) continue

    const day = new Date(point.key)
    const weekStart = startOfWeekMonday(day)
    const weekEnd = startOfDay(new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000))
    const key = weekStart.toISOString()
    const existing = weekMap.get(key)

    if (existing) {
      existing.count += point.count
      continue
    }

    weekMap.set(key, {
      label: formatWeekRange(weekStart, weekEnd),
      count: point.count,
      sortKey: weekStart.getTime(),
    })
  }

  return Array.from(weekMap.values())
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(({ label, count, sortKey }) => ({
      label,
      count,
      key: String(sortKey),
    }))
}

export type TimeSeriesPoint = {
  label: string
  count: number
  key: string
  isFuture?: boolean
}

export type TimeSeriesWindow = {
  series: TimeSeriesPoint[]
  periodLabel: string
  canGoForward: boolean
}

function countScansBetween(scans: PoiseLog[], start: Date, end: Date) {
  return scans.filter((row) => {
    const date = parseTimestamp(row.dtm_timestamp)
    return date && date >= start && date < end
  }).length
}

export function buildWeeklySeries(scans: PoiseLog[], weekOffset: number): TimeSeriesWindow {
  const currentWeekStart = startOfWeekMonday(new Date())
  const weekStart = startOfDay(
    new Date(currentWeekStart.getTime() - weekOffset * 7 * 24 * 60 * 60 * 1000)
  )
  const weekEnd = startOfDay(new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000))
  const today = startOfDay(new Date())

  const series = Array.from({ length: 7 }, (_, index) => {
    const day = startOfDay(new Date(weekStart.getTime() + index * 24 * 60 * 60 * 1000))
    const nextDay = startOfDay(new Date(day.getTime() + 24 * 60 * 60 * 1000))
    return {
      label: formatDayLabel(day),
      count: countScansBetween(scans, day, nextDay),
      key: day.toISOString(),
      isFuture: day.getTime() > today.getTime(),
    }
  })

  return {
    series,
    periodLabel: formatWeekRange(weekStart, weekEnd),
    canGoForward: weekOffset > 0,
  }
}

export function buildMonthlySeries(scans: PoiseLog[], monthOffset: number): TimeSeriesWindow {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1)
  const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate()
  const today = startOfDay(now)

  const series = Array.from({ length: daysInMonth }, (_, index) => {
    const day = startOfDay(new Date(monthStart.getFullYear(), monthStart.getMonth(), index + 1))
    const nextDay = startOfDay(new Date(day.getTime() + 24 * 60 * 60 * 1000))
    return {
      label: formatDayLabel(day),
      count: countScansBetween(scans, day, nextDay),
      key: day.toISOString(),
      isFuture: day.getTime() > today.getTime(),
    }
  })

  return {
    series,
    periodLabel: monthStart.toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
    canGoForward: monthOffset > 0,
  }
}

export type CalendarDayCell =
  | { kind: "padding" }
  | ({ kind: "day" } & TimeSeriesPoint & { dayOfMonth: number; dayIndex: number })

export type MonthlyCalendarWindow = TimeSeriesWindow & {
  weeks: CalendarDayCell[][]
}

export function buildMonthlyCalendarGrid(
  scans: PoiseLog[],
  monthOffset: number
): MonthlyCalendarWindow {
  const window = buildMonthlySeries(scans, monthOffset)
  const cells: CalendarDayCell[] = []

  if (window.series.length > 0) {
    const firstDay = new Date(window.series[0].key)
    const startOffset = (firstDay.getDay() + 6) % 7

    for (let index = 0; index < startOffset; index += 1) {
      cells.push({ kind: "padding" })
    }

    window.series.forEach((point, dayIndex) => {
      cells.push({
        kind: "day",
        ...point,
        dayOfMonth: dayIndex + 1,
        dayIndex,
      })
    })

    while (cells.length % 7 !== 0) {
      cells.push({ kind: "padding" })
    }
  }

  const weeks: CalendarDayCell[][] = []
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7))
  }

  return { ...window, weeks }
}

function percentChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

function museumSeenEntries(logs: PoiseLog[]) {
  const museumTagNames = new Set<string>(
    TRACKED_MUSEUM_ARTWORKS.map((artwork) => artwork.title)
  )

  return getSeenEntries(logs)
    .map(parseSeenEntry)
    .filter((entry): entry is ParsedSeen => {
      if (!entry?.textName?.trim()) return false
      return museumTagNames.has(entry.textName.trim())
    })
}

export function buildOverviewAnalytics(logs: PoiseLog[]) {
  const scans = getRedirectScans(logs)
  const now = new Date()
  const weekStart = startOfDay(new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000))
  const previousWeekStart = startOfDay(new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000))
  const monthStart = startOfMonth(now)

  const scansByTag = scans.reduce<Record<string, number>>((acc, row) => {
    const label = row.text_name?.trim() || row.txt_message?.trim() || "Unknown"
    acc[label] = (acc[label] ?? 0) + 1
    return acc
  }, {})

  const tagEntries = Object.entries(scansByTag).sort((a, b) => b[1] - a[1])
  const topTag = tagEntries[0] ?? ["-", 0]
  const activeTags = tagEntries.length
  const totalTaps = scans.length

  const thisWeek = scans.filter((row) => {
    const date = parseTimestamp(row.dtm_timestamp)
    return date && date >= weekStart
  }).length

  const previousWeek = scans.filter((row) => {
    const date = parseTimestamp(row.dtm_timestamp)
    return date && date >= previousWeekStart && date < weekStart
  }).length

  const topTagThisMonth = scans.filter((row) => {
    const date = parseTimestamp(row.dtm_timestamp)
    return date && date >= monthStart && (row.text_name?.trim() || "Unknown") === topTag[0]
  }).length

  return {
    totalTaps,
    activeTags,
    topTagName: topTag[0],
    topTagMonthCount: topTagThisMonth,
    avgPerTag: activeTags > 0 ? Math.round(totalTaps / activeTags) : 0,
    weeklyChange: percentChange(thisWeek, previousWeek),
  }
}

export function buildAudienceAnalytics(logs: PoiseLog[]) {
  const seen = museumSeenEntries(logs)
  const scans = getRedirectScans(logs)

  const deviceCounts: Record<DeviceKind, number> = {
    mobile: 0,
    desktop: 0,
    tablet: 0,
  }
  const browserCounts: Record<BrowserKind, number> = {
    Chrome: 0,
    Safari: 0,
    Firefox: 0,
    Edge: 0,
    Other: 0,
  }
  const hourlyCounts = Array.from({ length: 24 }, () => 0)
  const weekdayCounts = Array.from({ length: 7 }, () => 0)
  const osCounts: Record<OperatingSystemKind, number> = {
    iOS: 0,
    Android: 0,
    Windows: 0,
    macOS: 0,
    "Chrome OS": 0,
    Linux: 0,
    "Windows Phone": 0,
    Other: 0,
  }
  const languageCounts = new Map<string, number>()

  for (const entry of seen) {
    const device = parseDevice(entry.userAgent)
    const browser = parseBrowser(entry.userAgent)
    const os = parseOperatingSystem(entry.userAgent)
    deviceCounts[device] += 1
    browserCounts[browser] += 1
    osCounts[os] += 1
    for (const language of parseAcceptLanguages(entry.acceptLanguage)) {
      languageCounts.set(language, (languageCounts.get(language) ?? 0) + 1)
    }
  }

  for (const row of scans) {
    const date = parseTimestamp(row.dtm_timestamp)
    if (!date) continue
    hourlyCounts[date.getHours()] += 1
    const weekday = date.getDay()
    const weekdayIndex = weekday === 0 ? 6 : weekday - 1
    weekdayCounts[weekdayIndex] += 1
  }

  const deviceTotal = Object.values(deviceCounts).reduce((sum, count) => sum + count, 0)
  const browserTotal = Object.values(browserCounts).reduce((sum, count) => sum + count, 0)
  const osTotal = Object.values(osCounts).reduce((sum, count) => sum + count, 0)
  const languageVisitTotal = seen.length
  const hourlyMax = Math.max(...hourlyCounts, 1)
  const weekdayMax = Math.max(...weekdayCounts, 1)
  const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const

  const toPercent = (count: number, total: number) =>
    total > 0 ? Math.round((count / total) * 100) : 0

  return {
    devices: (["mobile", "desktop", "tablet"] as const).map((kind) => ({
      kind,
      count: deviceCounts[kind],
      percent: toPercent(deviceCounts[kind], deviceTotal),
    })),
    browsers: (["Chrome", "Safari", "Firefox", "Edge", "Other"] as const)
      .filter((kind) => kind !== "Other" || browserCounts.Other > 0)
      .map((kind) => ({
        kind,
        count: browserCounts[kind],
        percent: toPercent(browserCounts[kind], browserTotal),
      })),
    hourly: hourlyCounts.map((count, hour) => ({
      hour,
      count,
      intensity: count / hourlyMax,
    })),
    daily: weekdayCounts.map((count, weekday) => ({
      weekday,
      label: weekdayLabels[weekday],
      count,
      intensity: count / weekdayMax,
    })),
    hasDeviceData: deviceTotal > 0,
    deviceInfo: (
      [
        "iOS",
        "Android",
        "Windows",
        "macOS",
        "Chrome OS",
        "Linux",
        "Windows Phone",
        "Other",
      ] as const
    )
      .filter((kind) => osCounts[kind] > 0)
      .map((kind) => ({
        label: kind,
        count: osCounts[kind],
        percent: toPercent(osCounts[kind], osTotal),
      })),
    languages: [
      ...FEATURED_LANGUAGES.map((label) => ({
        label,
        count: languageCounts.get(label) ?? 0,
        percent: toPercent(languageCounts.get(label) ?? 0, languageVisitTotal),
      })),
      ...Array.from(languageCounts.entries())
        .filter(([label]) => !(FEATURED_LANGUAGES as readonly string[]).includes(label))
        .sort((a, b) => b[1] - a[1])
        .map(([label, count]) => ({
          label,
          count,
          percent: toPercent(count, languageVisitTotal),
        })),
    ],
    hasDeviceInfoData: osTotal > 0,
    hasLanguageData: languageVisitTotal > 0 && languageCounts.size > 0,
  }
}

export function getSarFromLog(log: PoiseLog): string | null {
  return buildActivityVisitDetails(log).sar
}

function buildMuseumSarByTagUid(logs: PoiseLog[]): Map<string, string> {
  const map = new Map<string, string>()
  for (const log of getMuseumLogs(logs)) {
    if ((log.txt_message_type ?? "").trim().toUpperCase() !== "SEEN") continue
    const sar = getSarFromLog(log)?.trim()
    const uid = log.txt_uid?.trim()
    if (sar && uid) map.set(uid, sar)
  }
  return map
}

function resolveSarForMuseumLog(log: PoiseLog, sarByUid: Map<string, string>): string | null {
  const direct = getSarFromLog(log)?.trim()
  if (direct) return direct
  const uid = log.txt_uid?.trim()
  if (uid) return sarByUid.get(uid) ?? null
  return null
}

/** Distinct SAR values seen on tracked .museum links (from SEEN cookies, linked to redirects by tag UID). */
export function listDistinctMuseumSars(logs: PoiseLog[]): string[] {
  const sarByUid = buildMuseumSarByTagUid(logs)
  const values = new Set<string>()
  for (const log of getMuseumLogs(logs)) {
    const sar = resolveSarForMuseumLog(log, sarByUid)
    if (sar) values.add(sar)
  }
  return [...values].sort((a, b) => a.localeCompare(b))
}

export type SarTimelineRowMeta = {
  sar: string
  country: string | null
  language: string | null
}

function getAcceptLanguageHeaderFromLog(log: PoiseLog): string | null {
  const parsed = parseSeenEntry(log)?.acceptLanguage
  if (parsed) return parsed
  const raw = log.txt_message?.trim()
  if (!raw?.startsWith("{")) return null
  try {
    const payload = JSON.parse(raw) as SeenPayload
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

function parsePrimaryLanguageTag(acceptLanguage: string | null | undefined): string | null {
  const tag = acceptLanguage?.split(",")[0]?.split(";")[0]?.trim()
  return tag || null
}

export function parseCountryFromAcceptLanguage(
  acceptLanguage: string | null | undefined
): string | null {
  const tag = parsePrimaryLanguageTag(acceptLanguage)
  if (!tag) return null
  const regionCode = tag.split("-")[1]?.toUpperCase()
  if (!regionCode || regionCode.length !== 2) return null
  try {
    const regions = new Intl.DisplayNames(["en"], { type: "region" })
    return regions.of(regionCode) ?? regionCode
  } catch {
    return regionCode
  }
}

export function parseLanguageNameFromAcceptLanguage(
  acceptLanguage: string | null | undefined
): string | null {
  const tag = parsePrimaryLanguageTag(acceptLanguage)
  if (!tag) return null
  const langCode = tag.split("-")[0]?.toLowerCase()
  if (!langCode) return null
  const canonical = CANONICAL_LANGUAGE_LABELS[langCode]
  if (canonical) return canonical
  try {
    const languages = new Intl.DisplayNames(["en"], { type: "language" })
    return languages.of(langCode) ?? langCode
  } catch {
    return langCode
  }
}

function formatSarRowMetaSubtitle(country: string | null, language: string | null) {
  const parts = [country, language].filter(Boolean)
  return parts.length > 0 ? parts.join(" · ") : "—"
}

/** Country + language for each SAR (from the newest SEEN row when available). */
export function buildSarTimelineRowMetaMap(logs: PoiseLog[]): Map<string, SarTimelineRowMeta> {
  const sarByUid = buildMuseumSarByTagUid(logs)
  const meta = new Map<string, SarTimelineRowMeta>()

  const seenCandidates = getMuseumLogs(logs)
    .filter((log) => (log.txt_message_type ?? "").trim().toUpperCase() === "SEEN")
    .map((log) => ({
      log,
      sar: resolveSarForMuseumLog(log, sarByUid),
      time: parseLogTimestampGmt(log.dtm_timestamp)?.getTime() ?? 0,
    }))
    .filter((entry): entry is typeof entry & { sar: string } => Boolean(entry.sar))
    .sort((a, b) => b.time - a.time)

  for (const { log, sar } of seenCandidates) {
    if (meta.has(sar)) continue
    const acceptLanguage = getAcceptLanguageHeaderFromLog(log)
    const country = parseCountryFromAcceptLanguage(acceptLanguage)
    const language = parseLanguageNameFromAcceptLanguage(acceptLanguage)
    meta.set(sar, { sar, country, language })
  }

  for (const sar of listDistinctMuseumSars(logs)) {
    if (meta.has(sar)) continue
    const related = getMuseumLogsForSar(logs, sar).sort((a, b) => {
      const aTime = parseLogTimestampGmt(a.dtm_timestamp)?.getTime() ?? 0
      const bTime = parseLogTimestampGmt(b.dtm_timestamp)?.getTime() ?? 0
      return bTime - aTime
    })
    const source =
      related.find((log) => (log.txt_message_type ?? "").trim().toUpperCase() === "SEEN") ??
      related[0]
    if (!source) {
      meta.set(sar, { sar, country: null, language: null })
      continue
    }
    const acceptLanguage = getAcceptLanguageHeaderFromLog(source)
    meta.set(sar, {
      sar,
      country: parseCountryFromAcceptLanguage(acceptLanguage),
      language: parseLanguageNameFromAcceptLanguage(acceptLanguage),
    })
  }

  return meta
}

export function formatSarTimelineRowMetaSubtitle(meta: SarTimelineRowMeta) {
  return formatSarRowMetaSubtitle(meta.country, meta.language)
}

/** All tracked .museum log rows for one SAR (case-insensitive). */
export function getMuseumLogsForSar(logs: PoiseLog[], sarQuery: string): PoiseLog[] {
  const target = sarQuery.trim().toLowerCase()
  if (!target) return []
  const sarByUid = buildMuseumSarByTagUid(logs)
  return getMuseumLogs(logs).filter((log) => {
    const sar = resolveSarForMuseumLog(log, sarByUid)
    return sar?.toLowerCase() === target
  })
}

export type SarMuseumTimelineEvent = {
  logId: number
  timestamp: string | null
  messageType: string
  artworkTitle: string
  link: string
}

export function buildSarMuseumTimelineEvents(
  logs: PoiseLog[],
  sarQuery: string
): SarMuseumTimelineEvent[] {
  return getMuseumLogsForSar(logs, sarQuery)
    .map((log) => {
      const artwork = resolveTrackedArtwork(log)
      return {
        logId: log.int_id,
        timestamp: log.dtm_timestamp,
        messageType: log.txt_message_type ?? "-",
        artworkTitle: artwork?.title ?? log.text_name?.trim() ?? "Unknown",
        link: getMuseumLogLink(log),
      }
    })
    .sort((a, b) => {
      const aTime = parseLogTimestampGmt(a.timestamp)?.getTime() ?? 0
      const bTime = parseLogTimestampGmt(b.timestamp)?.getTime() ?? 0
      return aTime - bTime
    })
}

/** Visible window: centre to each edge = this duration (1 hour per half). */
export const SAR_TIMELINE_VIEWPORT_HALF_MS = 60 * 60 * 1000

export const SAR_TIMELINE_ZOOM_MIN_HALF_MS = 2.5 * 60 * 1000
export const SAR_TIMELINE_ZOOM_MAX_HALF_MS = 60 * 60 * 1000

export const SAR_TIMELINE_ZOOM_LEVELS_HALF_MS = [
  2.5 * 60 * 1000,
  5 * 60 * 1000,
  10 * 60 * 1000,
  15 * 60 * 1000,
  30 * 60 * 1000,
  45 * 60 * 1000,
  60 * 60 * 1000,
] as const

export const SAR_TIMELINE_GRID_STEP_MS = 30 * 60 * 1000

export const SAR_TIMELINE_MAX_GRID_TICKS = 72

export const SAR_TIMELINE_MAX_VISIBLE_TICKS = 24

/** Treat as “full timeline” zoom when within this fraction of fit-all (handles extent drift). */
export const SAR_TIMELINE_FULL_WINDOW_RATIO = 0.98

export function sarTimelineGridStepMs(
  viewportHalfExtentMs: number,
  totalExtentMs: number
) {
  const half = viewportHalfExtentMs
  let step = SAR_TIMELINE_GRID_STEP_MS
  if (half >= 60 * 60 * 1000 - 500) step = 30 * 60 * 1000
  else if (half >= 45 * 60 * 1000 - 500) step = 20 * 60 * 1000
  else if (half >= 30 * 60 * 1000 - 500) step = 15 * 60 * 1000
  else if (half >= 15 * 60 * 1000 - 500) step = 10 * 60 * 1000
  else if (half >= 10 * 60 * 1000 - 500) step = 5 * 60 * 1000
  else if (half >= 5 * 60 * 1000 - 500) step = 2 * 60 * 1000
  else step = 1 * 60 * 1000

  const visibleSpanMs = viewportHalfExtentMs * 2
  step = Math.min(step, visibleSpanMs / 2)
  if (visibleSpanMs / step > SAR_TIMELINE_MAX_VISIBLE_TICKS) {
    step = visibleSpanMs / SAR_TIMELINE_MAX_VISIBLE_TICKS
  }

  if (sarTimelineIsFullWindow(half, totalExtentMs)) {
    return 30 * 24 * 60 * 60 * 1000
  }

  return Math.max(60 * 1000, step)
}

/** Half-window when the visible plot spans the full scrollable timeline. */
export function sarTimelineFitAllHalfMs(totalExtentMs: number) {
  return Math.max(SAR_TIMELINE_ZOOM_MIN_HALF_MS, totalExtentMs)
}

/** Discrete zoom steps for a plot, ending at “full timeline” when data spans longer than 2h. */
export function sarTimelineZoomLevelsForPlot(totalExtentMs: number): number[] {
  const fitAll = sarTimelineFitAllHalfMs(totalExtentMs)
  const levels = SAR_TIMELINE_ZOOM_LEVELS_HALF_MS.filter((level) => level <= fitAll)
  if (levels.length === 0 || levels[levels.length - 1] < fitAll) {
    levels.push(fitAll)
  }
  return levels
}

export function sarTimelineZoomIndexForHalf(
  halfMs: number,
  totalExtentMs: number
): number {
  const levels = sarTimelineZoomLevelsForPlot(totalExtentMs)
  const exact = levels.indexOf(halfMs)
  if (exact >= 0) return exact
  let best = 0
  for (let i = 1; i < levels.length; i += 1) {
    if (Math.abs(levels[i] - halfMs) < Math.abs(levels[best] - halfMs)) {
      best = i
    }
  }
  return best
}

export function formatSarTimelineZoomSpan(
  halfExtentMs: number,
  totalExtentMs?: number
) {
  if (
    totalExtentMs != null &&
    sarTimelineIsFullWindow(halfExtentMs, totalExtentMs)
  ) {
    return "full timeline"
  }
  const spanMin = Math.round((halfExtentMs * 2) / 60000)
  if (spanMin <= 5) return "5 min"
  if (spanMin < 60) return `${spanMin} min`
  const hours = spanMin / 60
  if (hours >= 48) {
    const days = Math.round(hours / 24)
    return days === 1 ? "1 day" : `${days} days`
  }
  const roundedHours = Math.round(hours * 10) / 10
  return roundedHours === 1 ? "1 hour" : `${roundedHours} hours`
}

export function clampSarTimelineZoomHalfMs(halfMs: number) {
  return Math.max(
    SAR_TIMELINE_ZOOM_MIN_HALF_MS,
    Math.min(SAR_TIMELINE_ZOOM_MAX_HALF_MS, halfMs)
  )
}

export type SarTimelinePlotPoint = {
  logId: number
  sar: string
  timestamp: Date
  offsetMs: number
  messageType: string
  artworkTitle: string
  link: string
  isRedirect: boolean
}

export type SarTimelinePlot = {
  sars: string[]
  points: SarTimelinePlotPoint[]
  now: Date
  /** Full scrollable span from centre (≥ viewport half). */
  totalExtentMs: number
  viewportHalfExtentMs: number
  pastEdgeLabel: string
  futureEdgeLabel: string
}

function formatTimelineEdgeLabel(date: Date) {
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

/** Milliseconds per pixel at the current zoom (viewport width = 2× zoom half). */
export function sarTimelineMsPerPx(
  viewportHalfExtentMs: number,
  viewportWidthPx: number
) {
  return (2 * viewportHalfExtentMs) / viewportWidthPx
}

/** Full scrollable half-span from “now” (entire data range, no cap). */
export function sarTimelineMapExtentMs(totalExtentMs: number, _viewportHalfExtentMs?: number) {
  return totalExtentMs
}

/** Canvas width for the full timeline at the current zoom scale. */
export function sarTimelineCanvasWidthPx(
  totalExtentMs: number,
  viewportHalfExtentMs: number,
  viewportWidthPx: number
) {
  const msPerPx = sarTimelineMsPerPx(viewportHalfExtentMs, viewportWidthPx)
  return Math.max(viewportWidthPx, Math.ceil((2 * totalExtentMs) / msPerPx))
}

function sarTimelineOffsetMsFromScrollPx(
  scrollPx: number,
  totalExtentMs: number,
  viewportHalfExtentMs: number,
  viewportWidthPx: number
) {
  const msPerPx = sarTimelineMsPerPx(viewportHalfExtentMs, viewportWidthPx)
  return scrollPx * msPerPx - totalExtentMs
}

export type SarTimelineOffsetBounds = {
  minOffsetMs: number
  maxOffsetMs: number
}

export function sarTimelineOffsetBoundsForScroll(
  scrollLeftPx: number,
  viewportWidthPx: number,
  totalExtentMs: number,
  viewportHalfExtentMs: number,
  bufferViewportFraction = 1
): SarTimelineOffsetBounds {
  const bufferPx = viewportWidthPx * bufferViewportFraction
  return {
    minOffsetMs: Math.max(
      -totalExtentMs,
      sarTimelineOffsetMsFromScrollPx(
        scrollLeftPx - bufferPx,
        totalExtentMs,
        viewportHalfExtentMs,
        viewportWidthPx
      )
    ),
    maxOffsetMs: Math.min(
      totalExtentMs,
      sarTimelineOffsetMsFromScrollPx(
        scrollLeftPx + viewportWidthPx + bufferPx,
        totalExtentMs,
        viewportHalfExtentMs,
        viewportWidthPx
      )
    ),
  }
}

/** Pixel position of the anchor “now” (offset 0) on the canvas. */
export function sarTimelineNowPx(
  totalExtentMs: number,
  viewportHalfExtentMs: number,
  viewportWidthPx: number
) {
  return sarTimelinePointPx(0, totalExtentMs, viewportHalfExtentMs, viewportWidthPx)
}

export type SarTimelineViewportRange = {
  start: Date
  end: Date
  centre: Date
}

/** Time range currently visible in the scroll viewport. */
export function sarTimelineViewportRange(
  scrollLeftPx: number,
  viewportWidthPx: number,
  totalExtentMs: number,
  viewportHalfExtentMs: number,
  anchorNow: Date
): SarTimelineViewportRange {
  const leftOffset = sarTimelineOffsetMsFromScrollPx(
    scrollLeftPx,
    totalExtentMs,
    viewportHalfExtentMs,
    viewportWidthPx
  )
  const rightOffset = sarTimelineOffsetMsFromScrollPx(
    scrollLeftPx + viewportWidthPx,
    totalExtentMs,
    viewportHalfExtentMs,
    viewportWidthPx
  )
  const centreOffset = sarTimelineOffsetMsFromScrollPx(
    scrollLeftPx + viewportWidthPx / 2,
    totalExtentMs,
    viewportHalfExtentMs,
    viewportWidthPx
  )
  const anchorMs = anchorNow.getTime()
  return {
    start: new Date(anchorMs + leftOffset),
    end: new Date(anchorMs + rightOffset),
    centre: new Date(anchorMs + centreOffset),
  }
}

export function formatSarTimelineViewRange(range: SarTimelineViewportRange): string {
  const sameDay =
    range.start.toUTCString().slice(0, 16) === range.end.toUTCString().slice(0, 16)
  const dayFmt = (d: Date) =>
    d.toLocaleString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    })
  const timeFmt = (d: Date) =>
    `${d.toLocaleString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    })} GMT`
  if (sameDay) {
    return `${dayFmt(range.start)}, ${timeFmt(range.start)} – ${timeFmt(range.end)}`
  }
  return `${dayFmt(range.start)} ${timeFmt(range.start)} – ${dayFmt(range.end)} ${timeFmt(range.end)}`
}

export function sarTimelinePointPx(
  offsetMs: number,
  totalExtentMs: number,
  viewportHalfExtentMs: number,
  viewportWidthPx: number
) {
  const msPerPx = sarTimelineMsPerPx(viewportHalfExtentMs, viewportWidthPx)
  const canvasWidth = sarTimelineCanvasWidthPx(
    totalExtentMs,
    viewportHalfExtentMs,
    viewportWidthPx
  )
  const clamped = Math.max(-totalExtentMs, Math.min(totalExtentMs, offsetMs))
  const leftPx = (clamped + totalExtentMs) / msPerPx
  return Math.max(0, Math.min(canvasWidth, leftPx))
}

/** Pixels to scroll for one hour at the current zoom (viewport = 2× zoom half). */
export function sarTimelineHourScrollPx(
  _totalExtentMs: number,
  viewportHalfExtentMs: number,
  viewportWidthPx: number
) {
  return (60 * 60 * 1000) / sarTimelineMsPerPx(viewportHalfExtentMs, viewportWidthPx)
}

export function sarTimelineIsFullWindow(
  viewportHalfExtentMs: number,
  totalExtentMs: number
) {
  const fitAll = sarTimelineFitAllHalfMs(totalExtentMs)
  return viewportHalfExtentMs >= fitAll * SAR_TIMELINE_FULL_WINDOW_RATIO
}

function utcMonthStartMs(epochMs: number) {
  const d = new Date(epochMs)
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)
}

function utcAddMonthsMs(epochMs: number, months: number) {
  const d = new Date(epochMs)
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + months, 1)
}

export function formatSarTimelineMonthLabel(date: Date, showYear = false) {
  if (showYear) {
    return date.toLocaleString("en-GB", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    })
  }
  return date.toLocaleString("en-GB", {
    month: "short",
    timeZone: "UTC",
  })
}

export function formatSarTimelineTickLabel(date: Date, includeDate = false) {
  const utc: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }
  if (includeDate) {
    return date.toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      ...utc,
    })
  }
  return date.toLocaleString("en-GB", utc)
}

export type SarTimelineGridTick = {
  offsetMs: number
  leftPx: number
  label: string
  isHour: boolean
  isTrueNow: boolean
}

function buildSarTimelineMonthTicks(
  totalExtentMs: number,
  viewportHalfExtentMs: number,
  viewportWidthPx: number,
  anchorNow: Date,
  visibleBounds?: SarTimelineOffsetBounds
): SarTimelineGridTick[] {
  const nowMs = anchorNow.getTime()
  const minOffset = visibleBounds?.minOffsetMs ?? -totalExtentMs
  const maxOffset = visibleBounds?.maxOffsetMs ?? totalExtentMs
  const earliestMs = nowMs + Math.max(-totalExtentMs, minOffset)
  const latestMs = nowMs + Math.min(totalExtentMs, maxOffset)

  let monthStartMs = utcMonthStartMs(earliestMs)
  if (monthStartMs < earliestMs) {
    monthStartMs = utcAddMonthsMs(monthStartMs, 1)
  }

  const ticks: SarTimelineGridTick[] = []
  let previousYear: number | null = null
  let lastLabelPx = -Infinity
  const minLabelGapPx = 64

  for (
    let tickMs = monthStartMs;
    tickMs <= latestMs;
    tickMs = utcAddMonthsMs(tickMs, 1)
  ) {
    const tickDate = new Date(tickMs)
    const year = tickDate.getUTCFullYear()
    const showYear = previousYear == null || year !== previousYear
    previousYear = year
    const offsetMs = tickMs - nowMs
    const leftPx = sarTimelinePointPx(
      offsetMs,
      totalExtentMs,
      viewportHalfExtentMs,
      viewportWidthPx
    )
    if (ticks.length > 0 && leftPx - lastLabelPx < minLabelGapPx) continue
    lastLabelPx = leftPx
    ticks.push({
      offsetMs,
      leftPx,
      label: formatSarTimelineMonthLabel(tickDate, showYear),
      isHour: false,
      isTrueNow: false,
    })
  }

  return ticks.sort((a, b) => a.offsetMs - b.offsetMs)
}

export function buildSarTimelineGridTicks(
  totalExtentMs: number,
  viewportHalfExtentMs: number,
  viewportWidthPx: number,
  anchorNow: Date,
  visibleBounds?: SarTimelineOffsetBounds
): SarTimelineGridTick[] {
  if (sarTimelineIsFullWindow(viewportHalfExtentMs, totalExtentMs)) {
    return buildSarTimelineMonthTicks(
      totalExtentMs,
      viewportHalfExtentMs,
      viewportWidthPx,
      anchorNow,
      visibleBounds
    )
  }

  const stepMs = sarTimelineGridStepMs(viewportHalfExtentMs, totalExtentMs)
  const hourMs = 60 * 60 * 1000
  const nowMs = anchorNow.getTime()
  const minOffset = visibleBounds?.minOffsetMs ?? -totalExtentMs
  const maxOffset = visibleBounds?.maxOffsetMs ?? totalExtentMs
  const earliestMs = nowMs + Math.max(-totalExtentMs, minOffset)
  const latestMs = nowMs + Math.min(totalExtentMs, maxOffset)
  const firstTickMs = Math.ceil(earliestMs / stepMs) * stepMs
  const ticks: SarTimelineGridTick[] = []
  let previousDay = ""

  for (let tickMs = firstTickMs; tickMs <= latestMs; tickMs += stepMs) {
    const offsetMs = tickMs - nowMs
    const tickDate = new Date(tickMs)
    const dayKey = tickDate.toUTCString().slice(0, 16)
    const includeDate = dayKey !== previousDay
    previousDay = dayKey
    ticks.push({
      offsetMs,
      leftPx: sarTimelinePointPx(
        offsetMs,
        totalExtentMs,
        viewportHalfExtentMs,
        viewportWidthPx
      ),
      label: formatSarTimelineTickLabel(tickDate, includeDate),
      isHour: tickMs % hourMs === 0,
      isTrueNow: false,
    })
  }

  const nowLeftPx = sarTimelinePointPx(0, totalExtentMs, viewportHalfExtentMs, viewportWidthPx)
  const hasNowLabel = ticks.some((tick) => Math.abs(tick.offsetMs) < stepMs / 4)
  if (!hasNowLabel) {
    ticks.push({
      offsetMs: 0,
      leftPx: nowLeftPx,
      label: "Now",
      isHour: true,
      isTrueNow: true,
    })
  }

  return ticks.sort((a, b) => a.offsetMs - b.offsetMs)
}

/** All SAR rows on Y; time on X with now centered (past left, future right). */
export function buildSarTimelinePlot(logs: PoiseLog[]): SarTimelinePlot | null {
  const sarByUid = buildMuseumSarByTagUid(logs)
  const now = new Date()
  const nowMs = now.getTime()
  const rawPoints: Omit<SarTimelinePlotPoint, "xPercent">[] = []

  for (const log of getMuseumLogs(logs)) {
    const sar = resolveSarForMuseumLog(log, sarByUid)
    if (!sar) continue
    const timestamp = parseLogTimestampGmt(log.dtm_timestamp)
    if (!timestamp) continue
    const artwork = resolveTrackedArtwork(log)
    const messageType = (log.txt_message_type ?? "-").trim()
    rawPoints.push({
      logId: log.int_id,
      sar,
      timestamp,
      offsetMs: timestamp.getTime() - nowMs,
      messageType,
      artworkTitle: artwork?.title ?? log.text_name?.trim() ?? "Unknown",
      link: getMuseumLogLink(log),
      isRedirect: messageType.toUpperCase() === "REDIRECTED",
    })
  }

  if (rawPoints.length === 0) return null

  const maxAbsOffset = rawPoints.reduce(
    (max, point) => Math.max(max, Math.abs(point.offsetMs)),
    0
  )
  const viewportHalfExtentMs = SAR_TIMELINE_VIEWPORT_HALF_MS
  const totalExtentMs = Math.max(
    viewportHalfExtentMs,
    Math.ceil(maxAbsOffset * 1.05)
  )

  const sars = [...new Set(rawPoints.map((point) => point.sar))].sort((a, b) =>
    a.localeCompare(b)
  )

  const points = [...rawPoints].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  )

  const pastEdge = new Date(nowMs - totalExtentMs)
  const futureEdge = new Date(nowMs + totalExtentMs)

  return {
    sars,
    points,
    now,
    totalExtentMs,
    viewportHalfExtentMs,
    pastEdgeLabel: formatTimelineEdgeLabel(pastEdge),
    futureEdgeLabel: formatTimelineEdgeLabel(futureEdge),
  }
}

export function formatNumber(value: number) {
  return value.toLocaleString("en-GB")
}

export function formatSignedPercent(value: number) {
  const rounded = Math.round(value * 10) / 10
  const prefix = rounded > 0 ? "+" : ""
  return `${prefix}${rounded}%`
}
