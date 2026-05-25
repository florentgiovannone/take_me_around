import { createContext, useContext, type ReactNode } from "react"
import type { SiteScope } from "@tma/config"

const SiteScopeContext = createContext<SiteScope>("gallery")

export function SiteScopeProvider({
  scope,
  children,
}: {
  scope: SiteScope
  children: ReactNode
}) {
  return <SiteScopeContext.Provider value={scope}>{children}</SiteScopeContext.Provider>
}

export function useSiteAnalyticsScope(): SiteScope {
  return useContext(SiteScopeContext)
}
