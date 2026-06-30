import type { QingmingFestivalCopy } from "../data/qingmingFestival"
import { QINGMING_FESTIVAL_EN } from "../data/qingmingFestival"
import { QINGMING_FESTIVAL_AR } from "../data/qingmingFestival.ar"
import { QINGMING_FESTIVAL_DE } from "../data/qingmingFestival.de"
import { QINGMING_FESTIVAL_ES } from "../data/qingmingFestival.es"
import { QINGMING_FESTIVAL_FR } from "../data/qingmingFestival.fr"
import { QINGMING_FESTIVAL_IT } from "../data/qingmingFestival.it"
import { QINGMING_FESTIVAL_JA } from "../data/qingmingFestival.ja"
import { QINGMING_FESTIVAL_KO } from "../data/qingmingFestival.ko"
import { QINGMING_FESTIVAL_PT } from "../data/qingmingFestival.pt"
import { QINGMING_FESTIVAL_TR } from "../data/qingmingFestival.tr"
import { QINGMING_FESTIVAL_ZH } from "../data/qingmingFestival.zh"
import {
  detectArtworkPageLocale,
  type ArtworkPageLocale,
} from "./artworkPageLocale"

export function detectQingmingFestivalLocale(
  search?: Pick<URLSearchParams, "get">,
): ArtworkPageLocale {
  return detectArtworkPageLocale(search)
}

const LOCALES: Record<Exclude<ArtworkPageLocale, "en">, QingmingFestivalCopy> = {
  fr: QINGMING_FESTIVAL_FR,
  ja: QINGMING_FESTIVAL_JA,
  ar: QINGMING_FESTIVAL_AR,
  de: QINGMING_FESTIVAL_DE,
  es: QINGMING_FESTIVAL_ES,
  ko: QINGMING_FESTIVAL_KO,
  zh: QINGMING_FESTIVAL_ZH,
  pt: QINGMING_FESTIVAL_PT,
  tr: QINGMING_FESTIVAL_TR,
  it: QINGMING_FESTIVAL_IT,
}

export function resolveQingmingFestivalCopy(locale: ArtworkPageLocale): QingmingFestivalCopy {
  if (locale === "en") return QINGMING_FESTIVAL_EN
  return LOCALES[locale]
}
