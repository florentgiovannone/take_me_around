import { createContext, useContext, useMemo, type ReactNode } from "react"
import {
  setDashboardLocale,
  type DashboardLocale,
  type SiteScope,
} from "@tma/config"
import { dashboardCopy, type DashboardCopy } from "../i18n/copy"

type SiteAnalyticsContextValue = {
  scope: SiteScope
  locale: DashboardLocale
  copy: DashboardCopy
}

const SiteScopeContext = createContext<SiteAnalyticsContextValue>({
  scope: "gallery",
  locale: "en",
  copy: dashboardCopy("en"),
})

export function SiteScopeProvider({
  scope,
  locale = "en",
  children,
}: {
  scope: SiteScope
  locale?: DashboardLocale
  children: ReactNode
}) {
  setDashboardLocale(locale)
  const value = useMemo(
    () => ({
      scope,
      locale,
      copy: dashboardCopy(locale),
    }),
    [scope, locale]
  )

  return <SiteScopeContext.Provider value={value}>{children}</SiteScopeContext.Provider>
}

export function useSiteAnalyticsScope(): SiteScope {
  return useContext(SiteScopeContext).scope
}

export function useDashboardLocale(): DashboardLocale {
  return useContext(SiteScopeContext).locale
}

export function useDashboardCopy(): DashboardCopy {
  return useContext(SiteScopeContext).copy
}
