export {
  detectDashboardLocale,
  dashboardIntlLocale,
  getDashboardLocale,
  setDashboardLocale,
  type DashboardLocale,
} from "./dashboardLocale"
import { getDashboardLocale } from "./dashboardLocale"

export type SiteId = "gallery" | "museum" | "arkin" | "church_of_england"

export type OperatorSiteId = SiteId | "tma_demo"

export type StoreDashboardScope = "waitburys" | "charles_peters"

export type SiteScope = OperatorSiteId | "combined" | StoreDashboardScope

export const ALL_SITE_IDS: SiteId[] = ["gallery", "museum", "arkin", "church_of_england"]

export const PICKABLE_SITE_IDS: SiteId[] = ["gallery", "museum", "church_of_england"]

export const ALL_DASHBOARD_SITE_IDS: OperatorSiteId[] = [
  "gallery",
  "museum",
  "church_of_england",
  "arkin",
  "tma_demo",
]

export const SITE_META: Record<
  OperatorSiteId,
  { label: string; domainLabel: string; host: string }
> = {
  gallery: {
    label: "Gallery",
    domainLabel: ".gallery",
    host: "takemearound.gallery",
  },
  museum: {
    label: "Museum",
    domainLabel: ".museum",
    host: "takemearound.museum",
  },
  arkin: {
    label: "Arkin Gallery",
    domainLabel: "Arkin Gallery",
    host: "arkin.takemearound.gallery",
  },
  church_of_england: {
    label: "Church of England",
    domainLabel: "Church of England",
    host: "takemearound.church",
  },
  tma_demo: {
    label: "TMA Demo",
    domainLabel: "TMA Demo",
    host: "TMA Demo",
  },
}

const MAX_TAG_SERIAL = 999_999

function padTagNumber(value: number) {
  return value < 1000 ? String(value).padStart(3, "0") : String(value)
}

function serialNumber(serial: string): number | null {
  if (!/^\d+$/.test(serial)) return null
  const n = Number(serial)
  if (!Number.isInteger(n) || n < 1 || n > MAX_TAG_SERIAL) return null
  return n
}

function tagNameRange(prefix: string, from: number, to: number): string[] {
  const names: string[] = []
  for (let n = from; n <= to; n += 1) {
    names.push(`${prefix}${padTagNumber(n)}`)
  }
  return names
}

export const TMA_DEMO_TAG_NAMES = [
  ...tagNameRange("TTOD", 1, 7),
  ...tagNameRange("TK", 1, 7),
  ...tagNameRange("TSN", 1, 7),
] as const

export type TmaDemoTagName = (typeof TMA_DEMO_TAG_NAMES)[number]

const TMA_DEMO_TAG_NAME_SET = new Set<string>(TMA_DEMO_TAG_NAMES)

const TMA_DEMO_TAG_PREFIXES = ["TTOD", "TSN", "TK"] as const

function compactTagToken(value: string) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "")
}

function tagFromPrefixAndSerial(
  prefix: (typeof TMA_DEMO_TAG_PREFIXES)[number],
  serial: string
): string | null {
  const n = serialNumber(serial)
  if (n == null) return null
  return `${prefix}${padTagNumber(n)}`
}

function tagFromCompact(compact: string): string | null {
  if (TMA_DEMO_TAG_NAME_SET.has(compact)) return compact

  const dendurMatch = compact.match(/^T+TOD(\d{1,6})$/)
  if (dendurMatch) {
    const canonical = tagFromPrefixAndSerial("TTOD", dendurMatch[1])
    if (canonical) return canonical
  }

  for (const prefix of TMA_DEMO_TAG_PREFIXES) {
    const match = compact.match(new RegExp(`^${prefix}(\\d{1,6})$`))
    if (!match) continue
    const canonical = tagFromPrefixAndSerial(prefix, match[1])
    if (canonical) return canonical
  }

  return null
}

function extractEmbeddedTmaDemoTag(value: string): string | null {
  const upper = value.toUpperCase()
  const patterns: { prefix: (typeof TMA_DEMO_TAG_PREFIXES)[number]; re: RegExp }[] = [
    { prefix: "TTOD", re: /(?:^|[^A-Z0-9])T+TOD[\s\-_]*(\d{1,6})(?!\d)/ },
    { prefix: "TSN", re: /(?:^|[^A-Z0-9])TSN[\s\-_]*(\d{1,6})(?!\d)/ },
    { prefix: "TK", re: /(?:^|[^A-Z0-9])TK[\s\-_]*(\d{1,6})(?!\d)/ },
  ]

  for (const { prefix, re } of patterns) {
    const match = upper.match(re)
    if (!match) continue
    const canonical = tagFromPrefixAndSerial(prefix, match[1])
    if (canonical) return canonical
  }

  return null
}

const TMA_DEMO_TITLE_ALIASES: {
  prefix: (typeof TMA_DEMO_TAG_PREFIXES)[number]
  titles: string[]
}[] = [
  { prefix: "TSN", titles: ["the starry night", "starry night", "a noite estrelada"] },
  { prefix: "TK", titles: ["the kiss", "o beijo"] },
  { prefix: "TTOD", titles: ["the temple of dendur", "temple of dendur", "o templo de dendur"] },
]

function normalizeTitlePhrase(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
}

function extractTitleAndSerial(value: string): string | null {
  const normalized = normalizeTitlePhrase(value)
  const match = normalized.match(/^(.*?)(?:\s+)(\d{1,6})$/)
  if (!match) return null

  const title = match[1].trim()
  if (!title) return null

  for (const { prefix, titles } of TMA_DEMO_TITLE_ALIASES) {
    if (!titles.includes(title)) continue
    const canonical = tagFromPrefixAndSerial(prefix, match[2])
    if (canonical) return canonical
  }

  return null
}

export function canonicalTmaDemoTagName(
  name: string | null | undefined,
  options?: { allowTitleAliases?: boolean }
): string | null {
  if (!name?.trim()) return null
  const trimmed = name.trim()
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) return null

  const compact = compactTagToken(trimmed)
  if (compact) {
    const fromCompact = tagFromCompact(compact)
    if (fromCompact) return fromCompact
  }

  const embedded = extractEmbeddedTmaDemoTag(trimmed)
  if (embedded) return embedded
  if (options?.allowTitleAliases === false) return null
  return extractTitleAndSerial(trimmed)
}

export function isTmaDemoTagName(name: string | null | undefined): boolean {
  return canonicalTmaDemoTagName(name) !== null
}

/** True for TTOD/TK/TSN codes only — not artwork-title aliases like "Starry Night 007". */
export function isTmaDemoCodeName(name: string | null | undefined): boolean {
  return canonicalTmaDemoTagName(name, { allowTitleAliases: false }) !== null
}

const TMA_DEMO_PREFIX_LABELS: { prefix: string; label: string }[] = [
  { prefix: "TTOD", label: "The Temple of Dendur" },
  { prefix: "TSN", label: "The Starry Night" },
  { prefix: "TK", label: "The Kiss" },
]

const TMA_DEMO_PREFIX_LABELS_PT: { prefix: string; label: string }[] = [
  { prefix: "TTOD", label: "O Templo de Dendur" },
  { prefix: "TSN", label: "A Noite Estrelada" },
  { prefix: "TK", label: "O Beijo" },
]

export function tmaDemoDisplayTitle(name: string | null | undefined): string {
  const canonical = canonicalTmaDemoTagName(name)
  if (!canonical) return name?.trim() ?? ""

  const labels =
    getDashboardLocale() === "pt-BR" ? TMA_DEMO_PREFIX_LABELS_PT : TMA_DEMO_PREFIX_LABELS

  for (const { prefix, label } of labels) {
    if (!canonical.startsWith(prefix)) continue
    return `${label} - ${canonical}`
  }

  return canonical
}

export const SOUTHWELL_MINSTER_TAG_NAMES = [...tagNameRange("SM", 1, 7)] as const

export type SouthwellMinsterTagName = (typeof SOUTHWELL_MINSTER_TAG_NAMES)[number]

const SOUTHWELL_MINSTER_TAG_NAME_SET = new Set<string>(SOUTHWELL_MINSTER_TAG_NAMES)

function southwellTagFromSerial(serial: string): string | null {
  const n = serialNumber(serial)
  if (n == null) return null
  return `SM${padTagNumber(n)}`
}

function southwellTagFromCompact(compact: string): string | null {
  if (SOUTHWELL_MINSTER_TAG_NAME_SET.has(compact)) return compact
  const match = compact.match(/^SM(\d{1,6})$/)
  if (!match) return null
  return southwellTagFromSerial(match[1])
}

function extractEmbeddedSouthwellMinsterTag(value: string): string | null {
  const match = value.toUpperCase().match(/(?:^|[^A-Z0-9])SM[\s\-_]*(\d{1,6})(?!\d)/)
  if (!match) return null
  return southwellTagFromSerial(match[1])
}

const SOUTHWELL_MINSTER_TITLE_ALIASES = ["southwell minster", "southwell"]

function extractSouthwellTitleAndSerial(value: string): string | null {
  const normalized = normalizeTitlePhrase(value)
  const match = normalized.match(/^(.*?)(?:\s+)(\d{1,6})$/)
  if (!match) return null

  const title = match[1].trim()
  if (!title || !SOUTHWELL_MINSTER_TITLE_ALIASES.includes(title)) return null
  return southwellTagFromSerial(match[2])
}

export function canonicalSouthwellMinsterTagName(
  name: string | null | undefined
): string | null {
  if (!name?.trim()) return null
  const trimmed = name.trim()
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) return null

  const compact = compactTagToken(trimmed)
  if (compact) {
    const fromCompact = southwellTagFromCompact(compact)
    if (fromCompact) return fromCompact
  }

  return extractEmbeddedSouthwellMinsterTag(trimmed) ?? extractSouthwellTitleAndSerial(trimmed)
}

export function isSouthwellMinsterTagName(name: string | null | undefined): boolean {
  return canonicalSouthwellMinsterTagName(name) !== null
}

/** Tags owned by demo (TSN/TK/TTOD) or church (Southwell SM) dashboards. */
export function isReservedSiteTagName(name: string | null | undefined): boolean {
  return isTmaDemoCodeName(name) || isSouthwellMinsterTagName(name)
}

export function southwellMinsterDisplayTitle(name: string | null | undefined): string {
  const canonical = canonicalSouthwellMinsterTagName(name)
  if (!canonical) return name?.trim() ?? ""
  return `Southwell Minster - ${canonical}`
}

const combinedSitesLabel = PICKABLE_SITE_IDS.map((id) => SITE_META[id].domainLabel).join(
  " + "
)

export function scopeLabel(scope: SiteScope): string {
  if (scope === "combined") return "Combined"
  if (scope === "waitburys") return "Waitburys"
  if (scope === "charles_peters") return "Charles Peters"
  return SITE_META[scope].label
}

export function scopeSubtitle(scope: SiteScope): string {
  if (scope === "combined") {
    return `Live combined activity (${combinedSitesLabel})`
  }
  if (scope === "waitburys") return "Live Waitburys activity"
  if (scope === "charles_peters") return "Live Charles Peters activity"
  if (scope === "arkin") {
    return `Live ${SITE_META.arkin.label} activity`
  }
  return `Live ${SITE_META[scope].domainLabel} activity`
}

export function scopeDomainHint(scope: SiteScope): string {
  if (scope === "combined") {
    return PICKABLE_SITE_IDS.map((id) => SITE_META[id].host).join(" + ")
  }
  if (scope === "waitburys") return "Waitburys"
  if (scope === "charles_peters") return "Charles Peters"
  return SITE_META[scope].host
}

export function scopeBadgeLabel(scope: SiteScope): string {
  if (scope === "combined") return "Combined"
  if (scope === "waitburys") return "Waitburys"
  if (scope === "charles_peters") return "Charles Peters"
  return SITE_META[scope].domainLabel
}

export function scopeOptionLabel(scope: SiteScope, _combinedSiteIds: SiteId[] = PICKABLE_SITE_IDS): string {
  if (scope === "combined") {
    return "Combined (all dashboards)"
  }
  if (scope === "tma_demo") return SITE_META.tma_demo.label
  if (scope === "waitburys") return "Waitburys"
  if (scope === "charles_peters") return "Charles Peters"
  return `${SITE_META[scope].label} (${SITE_META[scope].domainLabel})`
}
