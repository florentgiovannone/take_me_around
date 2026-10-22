import {
  ALL_SITE_IDS,
  PROJECT_DASHBOARD_SCOPES,
  type SiteId,
  type SiteScope,
} from "@tma/config"

export const ENABLED_SITES_STORAGE_KEY = "tma-main-dashboard-enabled-sites"

export type EnabledDashboardSite = SiteId | (typeof PROJECT_DASHBOARD_SCOPES)[number]

export const SETTINGS_SITE_IDS: EnabledDashboardSite[] = [
  ...ALL_SITE_IDS,
  ...PROJECT_DASHBOARD_SCOPES,
]

const DEFAULT_ENABLED_SITES: EnabledDashboardSite[] = [...SETTINGS_SITE_IDS]

function isSiteId(value: string): value is SiteId {
  return (ALL_SITE_IDS as readonly string[]).includes(value)
}

function isEnabledDashboardSite(value: string): value is EnabledDashboardSite {
  return (SETTINGS_SITE_IDS as readonly string[]).includes(value)
}

function readSiteList(values: unknown[]): EnabledDashboardSite[] {
  return values.filter(
    (value): value is EnabledDashboardSite =>
      typeof value === "string" && isEnabledDashboardSite(value)
  )
}

export function getStoredEnabledSites(): EnabledDashboardSite[] {
  try {
    const raw = localStorage.getItem(ENABLED_SITES_STORAGE_KEY)
    if (!raw) return [...DEFAULT_ENABLED_SITES]
    const parsed = JSON.parse(raw) as unknown
    if (Array.isArray(parsed)) {
      const stored = readSiteList(parsed)
      const core = stored.filter(isSiteId)
      return normalizeEnabledSites([
        ...(core.length > 0 ? core : ALL_SITE_IDS),
        ...PROJECT_DASHBOARD_SCOPES,
      ])
    }
    if (
      parsed &&
      typeof parsed === "object" &&
      "v" in parsed &&
      parsed.v === 2 &&
      "sites" in parsed &&
      Array.isArray(parsed.sites)
    ) {
      const stored = readSiteList(parsed.sites)
      return stored.length > 0 ? normalizeEnabledSites(stored) : [...DEFAULT_ENABLED_SITES]
    }
    return [...DEFAULT_ENABLED_SITES]
  } catch {
    return [...DEFAULT_ENABLED_SITES]
  }
}

export function storeEnabledSites(siteIds: EnabledDashboardSite[]) {
  localStorage.setItem(
    ENABLED_SITES_STORAGE_KEY,
    JSON.stringify({ v: 2, sites: siteIds })
  )
}

export function enabledCoreSiteIds(siteIds: readonly EnabledDashboardSite[]): SiteId[] {
  return ALL_SITE_IDS.filter((siteId) => siteIds.includes(siteId))
}

export function scopesForEnabledSites(siteIds: readonly EnabledDashboardSite[]): SiteScope[] {
  const core = enabledCoreSiteIds(siteIds)
  if (core.length > 1) return ["combined", ...core]
  return [...core]
}

export function normalizeEnabledSites(siteIds: readonly EnabledDashboardSite[]): EnabledDashboardSite[] {
  const unique = SETTINGS_SITE_IDS.filter((siteId) => siteIds.includes(siteId))
  return unique.length > 0 ? unique : [...DEFAULT_ENABLED_SITES]
}
