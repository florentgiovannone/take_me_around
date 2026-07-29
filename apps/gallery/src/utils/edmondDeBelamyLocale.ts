import type { EdmondDeBelamyCopy } from "../data/edmondDeBelamy"
import { EDMOND_DE_BELAMY_EN } from "../data/edmondDeBelamy"
import { EDMOND_DE_BELAMY_AR } from "../data/edmondDeBelamy.ar"
import { EDMOND_DE_BELAMY_DE } from "../data/edmondDeBelamy.de"
import { EDMOND_DE_BELAMY_ES } from "../data/edmondDeBelamy.es"
import { EDMOND_DE_BELAMY_FR } from "../data/edmondDeBelamy.fr"
import { EDMOND_DE_BELAMY_IT } from "../data/edmondDeBelamy.it"
import { EDMOND_DE_BELAMY_JA } from "../data/edmondDeBelamy.ja"
import { EDMOND_DE_BELAMY_KO } from "../data/edmondDeBelamy.ko"
import { EDMOND_DE_BELAMY_PT } from "../data/edmondDeBelamy.pt"
import { EDMOND_DE_BELAMY_TR } from "../data/edmondDeBelamy.tr"
import { EDMOND_DE_BELAMY_ZH } from "../data/edmondDeBelamy.zh"
import {
  detectArtworkPageLocale,
  type ArtworkPageLocale,
} from "./artworkPageLocale"

export function detectEdmondDeBelamyLocale(
  search?: Pick<URLSearchParams, "get">,
): ArtworkPageLocale {
  return detectArtworkPageLocale(search)
}

const LOCALES: Record<Exclude<ArtworkPageLocale, "en">, EdmondDeBelamyCopy> = {
  fr: EDMOND_DE_BELAMY_FR,
  ja: EDMOND_DE_BELAMY_JA,
  ar: EDMOND_DE_BELAMY_AR,
  de: EDMOND_DE_BELAMY_DE,
  es: EDMOND_DE_BELAMY_ES,
  ko: EDMOND_DE_BELAMY_KO,
  zh: EDMOND_DE_BELAMY_ZH,
  pt: EDMOND_DE_BELAMY_PT,
  tr: EDMOND_DE_BELAMY_TR,
  it: EDMOND_DE_BELAMY_IT,
}

export function resolveEdmondDeBelamyCopy(locale: ArtworkPageLocale): EdmondDeBelamyCopy {
  if (locale === "en") return EDMOND_DE_BELAMY_EN
  return LOCALES[locale]
}
