export type SiteId = "gallery" | "museum" | "arkin"

export type SiteScope = SiteId | "combined"

export const PICKABLE_SITE_IDS: SiteId[] = ["gallery", "museum", "arkin"]

export const SITE_META: Record<
  SiteId,
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
    host: "arkingallery.netlify.app",
  },
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

export function scopeOptionLabel(scope: SiteScope): string {
  if (scope === "combined") {
    return `Combined (${combinedSitesLabel})`
  }
  return `${SITE_META[scope].label} (${SITE_META[scope].domainLabel})`
}
