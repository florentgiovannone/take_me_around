import type { HoaHakananaiCopy, HoaHakananaiLocale } from "../data/hoaHakananai"
import { HOA_HAKANANAI_EN } from "../data/hoaHakananai"
import { HOA_HAKANANAI_FR } from "../data/hoaHakananai.fr"
import { HOA_HAKANANAI_JA } from "../data/hoaHakananai.ja"

export function detectHoaLocale(search?: Pick<URLSearchParams, "get">): HoaHakananaiLocale {
  const forced = search?.get("lang")?.toLowerCase()
  if (forced === "fr" || forced === "french") return "fr"
  if (forced === "ja" || forced === "jp" || forced === "japanese") return "ja"
  if (forced === "en" || forced === "english") return "en"

  if (typeof navigator === "undefined") return "en"

  const candidates = [...(navigator.languages ?? []), navigator.language]
    .filter(Boolean)
    .map((lang) => lang.toLowerCase())

  for (const lang of candidates) {
    if (lang === "fr" || lang.startsWith("fr-")) return "fr"
    if (lang === "ja" || lang.startsWith("ja-")) return "ja"
  }

  return "en"
}

const LOCALES: Record<Exclude<HoaHakananaiLocale, "en">, HoaHakananaiCopy> = {
  fr: HOA_HAKANANAI_FR,
  ja: HOA_HAKANANAI_JA,
}

export function resolveHoaCopy(locale: HoaHakananaiLocale): HoaHakananaiCopy {
  if (locale === "en") return HOA_HAKANANAI_EN
  return LOCALES[locale]
}
