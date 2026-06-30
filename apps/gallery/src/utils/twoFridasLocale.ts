import type { TwoFridasCopy } from "../data/twoFridas"
import { TWO_FRIDAS_EN } from "../data/twoFridas"
import { TWO_FRIDAS_AR } from "../data/twoFridas.ar"
import { TWO_FRIDAS_DE } from "../data/twoFridas.de"
import { TWO_FRIDAS_ES } from "../data/twoFridas.es"
import { TWO_FRIDAS_FR } from "../data/twoFridas.fr"
import { TWO_FRIDAS_IT } from "../data/twoFridas.it"
import { TWO_FRIDAS_JA } from "../data/twoFridas.ja"
import { TWO_FRIDAS_KO } from "../data/twoFridas.ko"
import { TWO_FRIDAS_PT } from "../data/twoFridas.pt"
import { TWO_FRIDAS_TR } from "../data/twoFridas.tr"
import { TWO_FRIDAS_ZH } from "../data/twoFridas.zh"
import {
  detectArtworkPageLocale,
  type ArtworkPageLocale,
} from "./artworkPageLocale"

export function detectTwoFridasLocale(
  search?: Pick<URLSearchParams, "get">,
): ArtworkPageLocale {
  return detectArtworkPageLocale(search)
}

const LOCALES: Record<Exclude<ArtworkPageLocale, "en">, TwoFridasCopy> = {
  fr: TWO_FRIDAS_FR,
  ja: TWO_FRIDAS_JA,
  ar: TWO_FRIDAS_AR,
  de: TWO_FRIDAS_DE,
  es: TWO_FRIDAS_ES,
  ko: TWO_FRIDAS_KO,
  zh: TWO_FRIDAS_ZH,
  pt: TWO_FRIDAS_PT,
  tr: TWO_FRIDAS_TR,
  it: TWO_FRIDAS_IT,
}

export function resolveTwoFridasCopy(locale: ArtworkPageLocale): TwoFridasCopy {
  if (locale === "en") return TWO_FRIDAS_EN
  return LOCALES[locale]
}
