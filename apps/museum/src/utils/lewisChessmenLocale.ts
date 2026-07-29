import type { LewisChessmenCopy } from "../data/lewisChessmen"
import { LEWIS_CHESSMEN_EN } from "../data/lewisChessmen"
import { LEWIS_CHESSMEN_AR } from "../data/lewisChessmen.ar"
import { LEWIS_CHESSMEN_DE } from "../data/lewisChessmen.de"
import { LEWIS_CHESSMEN_ES } from "../data/lewisChessmen.es"
import { LEWIS_CHESSMEN_FR } from "../data/lewisChessmen.fr"
import { LEWIS_CHESSMEN_IT } from "../data/lewisChessmen.it"
import { LEWIS_CHESSMEN_JA } from "../data/lewisChessmen.ja"
import { LEWIS_CHESSMEN_KO } from "../data/lewisChessmen.ko"
import { LEWIS_CHESSMEN_PT } from "../data/lewisChessmen.pt"
import { LEWIS_CHESSMEN_TR } from "../data/lewisChessmen.tr"
import { LEWIS_CHESSMEN_ZH } from "../data/lewisChessmen.zh"
import {
  detectArtworkPageLocale,
  type ArtworkPageLocale,
} from "./artworkPageLocale"

export function detectLewisChessmenLocale(
  search?: Pick<URLSearchParams, "get">,
): ArtworkPageLocale {
  return detectArtworkPageLocale(search)
}

const LOCALES: Record<Exclude<ArtworkPageLocale, "en">, LewisChessmenCopy> = {
  fr: LEWIS_CHESSMEN_FR,
  ja: LEWIS_CHESSMEN_JA,
  ar: LEWIS_CHESSMEN_AR,
  de: LEWIS_CHESSMEN_DE,
  es: LEWIS_CHESSMEN_ES,
  ko: LEWIS_CHESSMEN_KO,
  zh: LEWIS_CHESSMEN_ZH,
  pt: LEWIS_CHESSMEN_PT,
  tr: LEWIS_CHESSMEN_TR,
  it: LEWIS_CHESSMEN_IT,
}

export function resolveLewisChessmenCopy(locale: ArtworkPageLocale): LewisChessmenCopy {
  if (locale === "en") return LEWIS_CHESSMEN_EN
  return LOCALES[locale]
}
