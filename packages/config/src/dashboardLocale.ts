export type DashboardLocale = "en" | "pt-BR"

let activeDashboardLocale: DashboardLocale = "en"

export function getDashboardLocale(): DashboardLocale {
  return activeDashboardLocale
}

export function setDashboardLocale(locale: DashboardLocale) {
  activeDashboardLocale = locale
}

export function dashboardIntlLocale(
  locale: DashboardLocale = getDashboardLocale()
): string {
  return locale === "pt-BR" ? "pt-BR" : "en-GB"
}

function normalizeLangTag(value: string) {
  return value.trim().toLowerCase().replace(/_/g, "-")
}

function isPortugueseOrIberianPhoneLocale(tag: string) {
  const normalized = normalizeLangTag(tag)
  if (!normalized) return false
  if (
    normalized === "pt" ||
    normalized.startsWith("pt-") ||
    normalized === "portuguese"
  ) {
    return true
  }

  const parts = normalized.split("-")
  const language = parts[0]
  const region = parts[parts.length - 1]
  if (language === "pt") return true
  return region === "br" || region === "pt"
}

/** Brazilian Portuguese when the device language/region is Brazil or Portugal. */
export function detectDashboardLocale(
  search?: Pick<URLSearchParams, "get">
): DashboardLocale {
  const forced = search?.get("lang")?.toLowerCase().replace(/_/g, "-")
  if (forced === "en" || forced === "english") return "en"
  if (
    forced === "pt" ||
    forced === "pt-br" ||
    forced === "pt-pt" ||
    forced === "portuguese" ||
    forced === "brasil" ||
    forced === "brazil"
  ) {
    return "pt-BR"
  }

  if (typeof navigator === "undefined") return "en"

  const candidates = [...(navigator.languages ?? []), navigator.language].filter(Boolean)
  for (const lang of candidates) {
    if (isPortugueseOrIberianPhoneLocale(lang)) return "pt-BR"
  }

  return "en"
}
