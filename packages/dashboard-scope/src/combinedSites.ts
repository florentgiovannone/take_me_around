import type { SiteId } from "@tma/config"
import { PICKABLE_SITE_IDS } from "@tma/config"

let activeCombinedSiteIds: SiteId[] = [...PICKABLE_SITE_IDS]

export function setActiveCombinedSiteIds(siteIds: SiteId[]) {
  activeCombinedSiteIds =
    siteIds.length > 0 ? [...siteIds] : [...PICKABLE_SITE_IDS]
}

export function getActiveCombinedSiteIds(): SiteId[] {
  return activeCombinedSiteIds
}

export function isActiveCombinedSite(siteId: SiteId): boolean {
  return activeCombinedSiteIds.includes(siteId)
}
