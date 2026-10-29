import { createContext, useContext, useMemo, type ReactNode } from "react"
import {
  setDashboardLocale,
  type DashboardLocale,
  type SiteScope,
} from "@tma/config"
import { dashboardCopy, type DashboardCopy } from "../i18n/copy"

type ScanRegistrationField = { label: string; value: string }

type SiteAnalyticsContextValue = {
  scope: SiteScope
  locale: DashboardLocale
  copy: DashboardCopy
  scanTitle: (title: string) => string
  scanRegistrationFields: (title: string) => ScanRegistrationField[] | null
}

const SiteScopeContext = createContext<SiteAnalyticsContextValue>({
  scope: "gallery",
  locale: "en",
  copy: dashboardCopy("en"),
  scanTitle: (title) => title,
  scanRegistrationFields: () => null,
})

export function SiteScopeProvider({
  scope,
  locale = "en",
  scanTitle,
  scanRegistrationFields,
  children,
}: {
  scope: SiteScope
  locale?: DashboardLocale
  scanTitle?: (title: string) => string
  scanRegistrationFields?: (title: string) => ScanRegistrationField[] | null
  children: ReactNode
}) {
  setDashboardLocale(locale)
  const value = useMemo(
    () => ({
      scope,
      locale,
      copy: dashboardCopy(locale),
      scanTitle: scanTitle ?? ((title: string) => title),
      scanRegistrationFields: scanRegistrationFields ?? (() => null),
    }),
    [scope, locale, scanTitle, scanRegistrationFields]
  )

  return <SiteScopeContext.Provider value={value}>{children}</SiteScopeContext.Provider>
}

export function useSiteAnalyticsScope(): SiteScope {
  return useContext(SiteScopeContext).scope
}

export function useDashboardLocale(): DashboardLocale {
  return useContext(SiteScopeContext).locale
}

export function useScanTitle(): (title: string) => string {
  return useContext(SiteScopeContext).scanTitle
}

export function useScanRegistrationFields(): (
  title: string
) => ScanRegistrationField[] | null {
  return useContext(SiteScopeContext).scanRegistrationFields
}

export function useDashboardCopy(): DashboardCopy {
  const { scope, locale, copy } = useContext(SiteScopeContext)
  return useMemo(() => {
    const portuguese = locale === "pt-BR"
    if (scope === "waitburys" || scope === "charles_peters") {
      return {
        ...copy,
        artworks: portuguese ? "Artigos" : "Articles",
        artwork: portuguese ? "Artigo" : "Article",
      }
    }
    if (scope === "church_of_england") {
      return {
        ...copy,
        artworks: portuguese ? "POIs da igreja" : "Church POIs",
        artwork: portuguese ? "POI da igreja" : "Church POI",
      }
    }
    if (scope === "choose_and_order") {
      return {
        ...copy,
        artworks: "POS tags",
        artwork: "POS tag",
      }
    }
    if (scope === "yesterday_forever") {
      return {
        ...copy,
        artworks: portuguese ? "Fotos" : "Photos",
        artwork: portuguese ? "Foto" : "Photo",
      }
    }
    if (scope === "fair_future") {
      return {
        ...copy,
        artworks: portuguese ? "Folhetos" : "Leaflets",
        artwork: portuguese ? "Folheto" : "Leaflet",
      }
    }
    return copy
  }, [scope, locale, copy])
}
