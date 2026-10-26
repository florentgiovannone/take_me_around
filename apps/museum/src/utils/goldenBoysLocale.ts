import type { GoldenBoysCopy } from "../data/goldenBoys"
import { GOLDEN_BOYS_EN } from "../data/goldenBoys"
import { GOLDEN_BOYS_AR } from "../data/goldenBoys.ar"
import { GOLDEN_BOYS_DE } from "../data/goldenBoys.de"
import { GOLDEN_BOYS_ES } from "../data/goldenBoys.es"
import { GOLDEN_BOYS_FR } from "../data/goldenBoys.fr"
import { GOLDEN_BOYS_IT } from "../data/goldenBoys.it"
import { GOLDEN_BOYS_JA } from "../data/goldenBoys.ja"
import { GOLDEN_BOYS_KO } from "../data/goldenBoys.ko"
import { GOLDEN_BOYS_PT } from "../data/goldenBoys.pt"
import { GOLDEN_BOYS_TR } from "../data/goldenBoys.tr"
import { GOLDEN_BOYS_ZH } from "../data/goldenBoys.zh"
import {
  detectArtworkPageLocale,
  type ArtworkPageLocale,
} from "./artworkPageLocale"

export function detectGoldenBoysLocale(
  search?: Pick<URLSearchParams, "get">,
): ArtworkPageLocale {
  return detectArtworkPageLocale(search)
}

const LOCALES: Record<Exclude<ArtworkPageLocale, "en">, GoldenBoysCopy> = {
  fr: GOLDEN_BOYS_FR,
  ja: GOLDEN_BOYS_JA,
  ar: GOLDEN_BOYS_AR,
  de: GOLDEN_BOYS_DE,
  es: GOLDEN_BOYS_ES,
  ko: GOLDEN_BOYS_KO,
  zh: GOLDEN_BOYS_ZH,
  pt: GOLDEN_BOYS_PT,
  tr: GOLDEN_BOYS_TR,
  it: GOLDEN_BOYS_IT,
}

export function resolveGoldenBoysCopy(locale: ArtworkPageLocale): GoldenBoysCopy {
  if (locale === "en") return GOLDEN_BOYS_EN
  return LOCALES[locale]
}
