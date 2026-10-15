import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react"
import { Link, useSearchParams, type LinkProps, type To } from "react-router-dom"
import { uiCopy, type UiCopy } from "./uiCopy"
import { detectArtworkPageLocale, type ArtworkPageLocale } from "../utils/artworkPageLocale"

const LocaleContext = createContext<ArtworkPageLocale>("en")

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [searchParams] = useSearchParams()
  const locale = useMemo(() => detectArtworkPageLocale(searchParams), [searchParams])

  useEffect(() => {
    const root = document.documentElement
    const previousLang = root.lang
    const previousDir = root.dir
    root.lang = locale
    root.dir = locale === "ar" ? "rtl" : "ltr"
    return () => {
      root.lang = previousLang
      root.dir = previousDir
    }
  }, [locale])

  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}

export function useLocale(): ArtworkPageLocale {
  return useContext(LocaleContext)
}

export function useUiCopy(): UiCopy {
  return uiCopy(useLocale())
}

function withLang(to: To, lang: string): To {
  if (typeof to === "string") {
    const hashIndex = to.indexOf("#")
    const hash = hashIndex >= 0 ? to.slice(hashIndex) : ""
    const path = hashIndex >= 0 ? to.slice(0, hashIndex) : to
    const url = new URL(path, "http://frieze.local")
    url.searchParams.set("lang", lang)
    return `${url.pathname}${url.search}${hash}`
  }
  const params = new URLSearchParams(typeof to.search === "string" ? to.search : undefined)
  params.set("lang", lang)
  return { ...to, search: params.toString() }
}

export function LocaleLink({ to, ...props }: LinkProps) {
  const [searchParams] = useSearchParams()
  const lang = searchParams.get("lang")
  return <Link to={lang ? withLang(to, lang) : to} {...props} />
}

export function useLocalizedPath() {
  const [searchParams] = useSearchParams()
  const lang = searchParams.get("lang")
  return (to: string) => (lang ? (withLang(to, lang) as string) : to)
}
