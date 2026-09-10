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

export type SiteScope = OperatorSiteId | "combined"

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

function padTagNumber(value: number) {
  return String(value).padStart(3, "0")
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
): TmaDemoTagName | null {
  const n = Number(serial)
  if (!Number.isInteger(n) || n < 1 || n > 7) return null
  const code = `${prefix}${padTagNumber(n)}`
  return TMA_DEMO_TAG_NAME_SET.has(code) ? (code as TmaDemoTagName) : null
}

function tagFromCompact(compact: string): TmaDemoTagName | null {
  if (TMA_DEMO_TAG_NAME_SET.has(compact)) return compact as TmaDemoTagName

  const dendurMatch = compact.match(/^T+TOD(\d{1,3})$/)
  if (dendurMatch) {
    const canonical = tagFromPrefixAndSerial("TTOD", dendurMatch[1])
    if (canonical) return canonical
  }

  for (const prefix of TMA_DEMO_TAG_PREFIXES) {
    const match = compact.match(new RegExp(`^${prefix}(\\d{1,3})$`))
    if (!match) continue
    const canonical = tagFromPrefixAndSerial(prefix, match[1])
    if (canonical) return canonical
  }

  return null
}

function extractEmbeddedTmaDemoTag(value: string): TmaDemoTagName | null {
  const upper = value.toUpperCase()
  const patterns: { prefix: (typeof TMA_DEMO_TAG_PREFIXES)[number]; re: RegExp }[] = [
    { prefix: "TTOD", re: /(?:^|[^A-Z0-9])T+TOD[\s\-_]*(\d{1,3})(?!\d)/ },
    { prefix: "TSN", re: /(?:^|[^A-Z0-9])TSN[\s\-_]*(\d{1,3})(?!\d)/ },
    { prefix: "TK", re: /(?:^|[^A-Z0-9])TK[\s\-_]*(\d{1,3})(?!\d)/ },
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

function extractTitleAndSerial(value: string): TmaDemoTagName | null {
  const normalized = normalizeTitlePhrase(value)
  const match = normalized.match(/^(.*?)(?:\s+)(\d{1,3})$/)
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
  name: string | null | undefined
): TmaDemoTagName | null {
  if (!name?.trim()) return null
  const trimmed = name.trim()
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) return null

  const compact = compactTagToken(trimmed)
  if (compact) {
    const fromCompact = tagFromCompact(compact)
    if (fromCompact) return fromCompact
  }

  return extractEmbeddedTmaDemoTag(trimmed) ?? extractTitleAndSerial(trimmed)
}

export function isTmaDemoTagName(name: string | null | undefined): boolean {
  return canonicalTmaDemoTagName(name) !== null
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

export const SOUTHWELL_MINSTER_TAG_NAMES = tagNameRange("SM", 1, 7) as const

export type SouthwellMinsterTagName = (typeof SOUTHWELL_MINSTER_TAG_NAMES)[number]

const SOUTHWELL_MINSTER_TAG_NAME_SET = new Set<string>(SOUTHWELL_MINSTER_TAG_NAMES)

function southwellTagFromSerial(serial: string): SouthwellMinsterTagName | null {
  const n = Number(serial)
  if (!Number.isInteger(n) || n < 1 || n > 7) return null
  const code = `SM${padTagNumber(n)}`
  return SOUTHWELL_MINSTER_TAG_NAME_SET.has(code) ? (code as SouthwellMinsterTagName) : null
}

function southwellTagFromCompact(compact: string): SouthwellMinsterTagName | null {
  if (SOUTHWELL_MINSTER_TAG_NAME_SET.has(compact)) return compact as SouthwellMinsterTagName
  const match = compact.match(/^SM(\d{1,3})$/)
  if (!match) return null
  return southwellTagFromSerial(match[1])
}

function extractEmbeddedSouthwellMinsterTag(value: string): SouthwellMinsterTagName | null {
  const match = value.toUpperCase().match(/(?:^|[^A-Z0-9])SM[\s\-_]*(\d{1,3})(?!\d)/)
  if (!match) return null
  return southwellTagFromSerial(match[1])
}

const SOUTHWELL_MINSTER_TITLE_ALIASES = ["southwell minster", "southwell"]

function extractSouthwellTitleAndSerial(value: string): SouthwellMinsterTagName | null {
  const normalized = normalizeTitlePhrase(value)
  const match = normalized.match(/^(.*?)(?:\s+)(\d{1,3})$/)
  if (!match) return null

  const title = match[1].trim()
  if (!title || !SOUTHWELL_MINSTER_TITLE_ALIASES.includes(title)) return null
  return southwellTagFromSerial(match[2])
}

export function canonicalSouthwellMinsterTagName(
  name: string | null | undefined
): SouthwellMinsterTagName | null {
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

/** Tags owned by another dashboard (TMA Demo slates or Southwell SM001–007). */
export function isReservedSiteTagName(name: string | null | undefined): boolean {
  return isTmaDemoTagName(name) || isSouthwellMinsterTagName(name)
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
  return SITE_META[scope].label
}

export function scopeSubtitle(scope: SiteScope): string {
  if (scope === "combined") {
    return `Live combined activity (${combinedSitesLabel})`
  }
  if (scope === "arkin") {
    return `Live ${SITE_META.arkin.label} activity`
  }
  return `Live ${SITE_META[scope].domainLabel} activity`
}

export function scopeDomainHint(scope: SiteScope): string {
  if (scope === "combined") {
    return PICKABLE_SITE_IDS.map((id) => SITE_META[id].host).join(" + ")
  }
  return SITE_META[scope].host
}

export function scopeBadgeLabel(scope: SiteScope): string {
  if (scope === "combined") return "Combined"
  return SITE_META[scope].domainLabel
}

export function scopeOptionLabel(scope: SiteScope, _combinedSiteIds: SiteId[] = PICKABLE_SITE_IDS): string {
  if (scope === "combined") {
    return "Combined (all dashboards)"
  }
  if (scope === "tma_demo") return SITE_META.tma_demo.label
  return `${SITE_META[scope].label} (${SITE_META[scope].domainLabel})`
}
