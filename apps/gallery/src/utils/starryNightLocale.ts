import type { StarryNightCopy } from "../data/starryNight"
import { STARRY_NIGHT_EN } from "../data/starryNight"
import { STARRY_NIGHT_AR } from "../data/starryNight.ar"
import { STARRY_NIGHT_DE } from "../data/starryNight.de"
import { STARRY_NIGHT_ES } from "../data/starryNight.es"
import { STARRY_NIGHT_FR } from "../data/starryNight.fr"
import { STARRY_NIGHT_IT } from "../data/starryNight.it"
import { STARRY_NIGHT_JA } from "../data/starryNight.ja"
import { STARRY_NIGHT_KO } from "../data/starryNight.ko"
import { STARRY_NIGHT_PT } from "../data/starryNight.pt"
import { STARRY_NIGHT_TR } from "../data/starryNight.tr"
import { STARRY_NIGHT_ZH } from "../data/starryNight.zh"
import {
  detectArtworkPageLocale,
  type ArtworkPageLocale,
} from "./artworkPageLocale"

export function detectStarryNightLocale(
  search?: Pick<URLSearchParams, "get">,
): ArtworkPageLocale {
  return detectArtworkPageLocale(search)
}

const LOCALES: Record<Exclude<ArtworkPageLocale, "en">, StarryNightCopy> = {
  fr: STARRY_NIGHT_FR,
  ja: STARRY_NIGHT_JA,
  ar: STARRY_NIGHT_AR,
  de: STARRY_NIGHT_DE,
  es: STARRY_NIGHT_ES,
  ko: STARRY_NIGHT_KO,
  zh: STARRY_NIGHT_ZH,
  pt: STARRY_NIGHT_PT,
  tr: STARRY_NIGHT_TR,
  it: STARRY_NIGHT_IT,
}

export function resolveStarryNightCopy(locale: ArtworkPageLocale): StarryNightCopy {
  if (locale === "en") return STARRY_NIGHT_EN
  return LOCALES[locale]
}
