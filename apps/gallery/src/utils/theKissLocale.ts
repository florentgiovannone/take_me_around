import type { TheKissCopy } from "../data/theKiss"
import { THE_KISS_EN } from "../data/theKiss"
import { THE_KISS_AR } from "../data/theKiss.ar"
import { THE_KISS_DE } from "../data/theKiss.de"
import { THE_KISS_ES } from "../data/theKiss.es"
import { THE_KISS_FR } from "../data/theKiss.fr"
import { THE_KISS_IT } from "../data/theKiss.it"
import { THE_KISS_JA } from "../data/theKiss.ja"
import { THE_KISS_KO } from "../data/theKiss.ko"
import { THE_KISS_PT } from "../data/theKiss.pt"
import { THE_KISS_TR } from "../data/theKiss.tr"
import { THE_KISS_ZH } from "../data/theKiss.zh"
import {
  detectArtworkPageLocale,
  type ArtworkPageLocale,
} from "./artworkPageLocale"

export function detectTheKissLocale(
  search?: Pick<URLSearchParams, "get">,
): ArtworkPageLocale {
  return detectArtworkPageLocale(search)
}

const LOCALES: Record<Exclude<ArtworkPageLocale, "en">, TheKissCopy> = {
  fr: THE_KISS_FR,
  ja: THE_KISS_JA,
  ar: THE_KISS_AR,
  de: THE_KISS_DE,
  es: THE_KISS_ES,
  ko: THE_KISS_KO,
  zh: THE_KISS_ZH,
  pt: THE_KISS_PT,
  tr: THE_KISS_TR,
  it: THE_KISS_IT,
}

export function resolveTheKissCopy(locale: ArtworkPageLocale): TheKissCopy {
  if (locale === "en") return THE_KISS_EN
  return LOCALES[locale]
}
