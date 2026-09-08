export type ArtworkPageLocale =
  | "en"
  | "fr"
  | "ja"
  | "ar"
  | "de"
  | "es"
  | "ko"
  | "zh"
  | "pt"
  | "tr"
  | "it"

const FORCED_LOCALE_ALIASES: Record<string, ArtworkPageLocale> = {
  en: "en",
  english: "en",
  fr: "fr",
  french: "fr",
  ja: "ja",
  jp: "ja",
  japanese: "ja",
  ar: "ar",
  arabic: "ar",
  de: "de",
  german: "de",
  es: "es",
  spanish: "es",
  ko: "ko",
  kr: "ko",
  korean: "ko",
  zh: "zh",
  cn: "zh",
  chinese: "zh",
  pt: "pt",
  portuguese: "pt",
  tr: "tr",
  turkish: "tr",
  it: "it",
  italian: "it",
}

const BROWSER_PREFIXES: [string, ArtworkPageLocale][] = [
  ["fr", "fr"],
  ["ja", "ja"],
  ["ar", "ar"],
  ["de", "de"],
  ["es", "es"],
  ["ko", "ko"],
  ["zh", "zh"],
  ["pt", "pt"],
  ["tr", "tr"],
  ["it", "it"],
]

export function detectArtworkPageLocale(
  search?: Pick<URLSearchParams, "get">,
): ArtworkPageLocale {
  const forced = search?.get("lang")?.toLowerCase()
  if (forced && forced in FORCED_LOCALE_ALIASES) {
    return FORCED_LOCALE_ALIASES[forced]
  }

  if (typeof navigator === "undefined") return "en"

  const candidates = [...(navigator.languages ?? []), navigator.language]
    .filter(Boolean)
    .map((lang) => lang.toLowerCase())

  for (const lang of candidates) {
    for (const [prefix, locale] of BROWSER_PREFIXES) {
      if (lang === prefix || lang.startsWith(`${prefix}-`)) return locale
    }
  }

  return "en"
}
