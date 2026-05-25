export type SiteId = "gallery" | "museum"

export type SiteScope = SiteId | "combined"

/** Sites shown on the standalone picker (gallery / museum only for now). */
export const PICKABLE_SITE_IDS: SiteId[] = ["gallery", "museum"]

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
}

export function scopeLabel(scope: SiteScope): string {
  if (scope === "gallery") return SITE_META.gallery.label
  if (scope === "museum") return SITE_META.museum.label
  return "Combined"
}

export function scopeSubtitle(scope: SiteScope): string {
  if (scope === "gallery") return `Live ${SITE_META.gallery.domainLabel} activity`
  if (scope === "museum") return `Live ${SITE_META.museum.domainLabel} activity`
  return `Live combined activity (${SITE_META.gallery.domainLabel} + ${SITE_META.museum.domainLabel})`
}

export function scopeDomainHint(scope: SiteScope): string {
  if (scope === "gallery") return SITE_META.gallery.host
  if (scope === "museum") return SITE_META.museum.host
  return `${SITE_META.gallery.host} + ${SITE_META.museum.host}`
}

export function scopeBadgeLabel(scope: SiteScope): string {
  if (scope === "combined") return "Combined"
  return SITE_META[scope].domainLabel
}

export function scopeOptionLabel(scope: SiteScope): string {
  if (scope === "combined") {
    return `Combined (${SITE_META.gallery.domainLabel} + ${SITE_META.museum.domainLabel})`
  }
  return `${SITE_META[scope].label} (${SITE_META[scope].domainLabel})`
}
