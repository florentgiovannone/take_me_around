import { ALL_SITE_IDS, PICKABLE_SITE_IDS, type SiteId } from "@tma/config"

export const ENABLED_SITES_STORAGE_KEY = "tma-main-dashboard-enabled-sites"

const DEFAULT_ENABLED_SITES: SiteId[] = [...PICKABLE_SITE_IDS]

function isSiteId(value: string): value is SiteId {
  return ALL_SITE_IDS.includes(value as SiteId)
}

export function getStoredEnabledSites(): SiteId[] {
  try {
    const raw = localStorage.getItem(ENABLED_SITES_STORAGE_KEY)
    if (!raw) return [...DEFAULT_ENABLED_SITES]
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return [...DEFAULT_ENABLED_SITES]
    const sites = parsed.filter((value): value is SiteId => typeof value === "string" && isSiteId(value))
    return sites.length > 0 ? sites : [...DEFAULT_ENABLED_SITES]
  } catch {
    return [...DEFAULT_ENABLED_SITES]
  }
}

export function storeEnabledSites(siteIds: SiteId[]) {
  localStorage.setItem(ENABLED_SITES_STORAGE_KEY, JSON.stringify(siteIds))
}

export function scopesForEnabledSites(siteIds: SiteId[]): import("@tma/config").SiteScope[] {
  const scopes: import("@tma/config").SiteScope[] = [...siteIds]
  if (siteIds.length > 1) {
    scopes.push("combined")
  }
  return scopes
}

export function normalizeEnabledSites(siteIds: SiteId[]): SiteId[] {
  const unique = ALL_SITE_IDS.filter((siteId) => siteIds.includes(siteId))
  return unique.length > 0 ? unique : [...DEFAULT_ENABLED_SITES]
}
