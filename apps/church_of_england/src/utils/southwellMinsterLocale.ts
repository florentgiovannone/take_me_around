import type { SouthwellMinsterCopy } from "../data/southwellMinster"
import { SOUTHWELL_MINSTER_EN } from "../data/southwellMinster"
import { SOUTHWELL_MINSTER_AR } from "../data/southwellMinster.ar"
import { SOUTHWELL_MINSTER_DE } from "../data/southwellMinster.de"
import { SOUTHWELL_MINSTER_ES } from "../data/southwellMinster.es"
import { SOUTHWELL_MINSTER_FR } from "../data/southwellMinster.fr"
import { SOUTHWELL_MINSTER_IT } from "../data/southwellMinster.it"
import { SOUTHWELL_MINSTER_JA } from "../data/southwellMinster.ja"
import { SOUTHWELL_MINSTER_KO } from "../data/southwellMinster.ko"
import { SOUTHWELL_MINSTER_PT } from "../data/southwellMinster.pt"
import { SOUTHWELL_MINSTER_TR } from "../data/southwellMinster.tr"
import { SOUTHWELL_MINSTER_ZH } from "../data/southwellMinster.zh"
import { detectArtworkPageLocale, type ArtworkPageLocale } from "./artworkPageLocale"

export function detectSouthwellMinsterLocale(
  search?: Pick<URLSearchParams, "get">,
): ArtworkPageLocale {
  return detectArtworkPageLocale(search)
}

const LOCALES: Record<Exclude<ArtworkPageLocale, "en">, SouthwellMinsterCopy> = {
  fr: SOUTHWELL_MINSTER_FR,
  ja: SOUTHWELL_MINSTER_JA,
  ar: SOUTHWELL_MINSTER_AR,
  de: SOUTHWELL_MINSTER_DE,
  es: SOUTHWELL_MINSTER_ES,
  ko: SOUTHWELL_MINSTER_KO,
  zh: SOUTHWELL_MINSTER_ZH,
  pt: SOUTHWELL_MINSTER_PT,
  tr: SOUTHWELL_MINSTER_TR,
  it: SOUTHWELL_MINSTER_IT,
}

export function resolveSouthwellMinsterCopy(locale: ArtworkPageLocale): SouthwellMinsterCopy {
  if (locale === "en") return SOUTHWELL_MINSTER_EN
  return LOCALES[locale]
}
