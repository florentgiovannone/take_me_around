import type { MonaLisaCopy } from "../data/monaLisa"
import { MONA_LISA_EN } from "../data/monaLisa"
import { MONA_LISA_AR } from "../data/monaLisa.ar"
import { MONA_LISA_DE } from "../data/monaLisa.de"
import { MONA_LISA_ES } from "../data/monaLisa.es"
import { MONA_LISA_FR } from "../data/monaLisa.fr"
import { MONA_LISA_IT } from "../data/monaLisa.it"
import { MONA_LISA_JA } from "../data/monaLisa.ja"
import { MONA_LISA_KO } from "../data/monaLisa.ko"
import { MONA_LISA_PT } from "../data/monaLisa.pt"
import { MONA_LISA_TR } from "../data/monaLisa.tr"
import { MONA_LISA_ZH } from "../data/monaLisa.zh"
import {
  detectArtworkPageLocale,
  type ArtworkPageLocale,
} from "./artworkPageLocale"

export function detectMonaLisaLocale(
  search?: Pick<URLSearchParams, "get">,
): ArtworkPageLocale {
  return detectArtworkPageLocale(search)
}

const LOCALES: Record<Exclude<ArtworkPageLocale, "en">, MonaLisaCopy> = {
  fr: MONA_LISA_FR,
  ja: MONA_LISA_JA,
  ar: MONA_LISA_AR,
  de: MONA_LISA_DE,
  es: MONA_LISA_ES,
  ko: MONA_LISA_KO,
  zh: MONA_LISA_ZH,
  pt: MONA_LISA_PT,
  tr: MONA_LISA_TR,
  it: MONA_LISA_IT,
}

export function resolveMonaLisaCopy(locale: ArtworkPageLocale): MonaLisaCopy {
  if (locale === "en") return MONA_LISA_EN
  return LOCALES[locale]
}
