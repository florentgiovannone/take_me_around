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
  ...tagNameRange("TK", 1, 7),
  ...tagNameRange("TS", 1, 7),
  ...tagNameRange("TSN", 1, 7),
  ...tagNameRange("TTOD", 1, 7),
] as const

export type TmaDemoTagName = (typeof TMA_DEMO_TAG_NAMES)[number]

const TMA_DEMO_TAG_NAME_SET = new Set<string>(TMA_DEMO_TAG_NAMES)

export function canonicalTmaDemoTagName(
  name: string | null | undefined
): TmaDemoTagName | null {
  const normalized = name?.trim().toUpperCase()
  if (!normalized || !TMA_DEMO_TAG_NAME_SET.has(normalized)) return null
  return normalized as TmaDemoTagName
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
    const serial = canonical.slice(prefix.length)
    return `${label} - ${serial}`
  }

  return canonical
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
