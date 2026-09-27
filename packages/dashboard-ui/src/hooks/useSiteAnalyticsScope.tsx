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
        artworks: portuguese ? "Objetos" : "Objects",
        artwork: portuguese ? "Objeto" : "Object",
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
