import type { StarOfBetlehemCopy } from "../data/starOfBetlehem"
import { STAR_OF_BETLEHEM_EN } from "../data/starOfBetlehem"
import { STAR_OF_BETLEHEM_AR } from "../data/starOfBetlehem.ar"
import { STAR_OF_BETLEHEM_DE } from "../data/starOfBetlehem.de"
import { STAR_OF_BETLEHEM_ES } from "../data/starOfBetlehem.es"
import { STAR_OF_BETLEHEM_FR } from "../data/starOfBetlehem.fr"
import { STAR_OF_BETLEHEM_IT } from "../data/starOfBetlehem.it"
import { STAR_OF_BETLEHEM_JA } from "../data/starOfBetlehem.ja"
import { STAR_OF_BETLEHEM_KO } from "../data/starOfBetlehem.ko"
import { STAR_OF_BETLEHEM_PT } from "../data/starOfBetlehem.pt"
import { STAR_OF_BETLEHEM_TR } from "../data/starOfBetlehem.tr"
import { STAR_OF_BETLEHEM_ZH } from "../data/starOfBetlehem.zh"
import {
  detectArtworkPageLocale,
  type ArtworkPageLocale,
} from "./artworkPageLocale"

export function detectStarOfBetlehemLocale(
  search?: Pick<URLSearchParams, "get">,
): ArtworkPageLocale {
  return detectArtworkPageLocale(search)
}

const LOCALES: Record<Exclude<ArtworkPageLocale, "en">, StarOfBetlehemCopy> = {
  fr: STAR_OF_BETLEHEM_FR,
  ja: STAR_OF_BETLEHEM_JA,
  ar: STAR_OF_BETLEHEM_AR,
  de: STAR_OF_BETLEHEM_DE,
  es: STAR_OF_BETLEHEM_ES,
  ko: STAR_OF_BETLEHEM_KO,
  zh: STAR_OF_BETLEHEM_ZH,
  pt: STAR_OF_BETLEHEM_PT,
  tr: STAR_OF_BETLEHEM_TR,
  it: STAR_OF_BETLEHEM_IT,
}

export function resolveStarOfBetlehemCopy(locale: ArtworkPageLocale): StarOfBetlehemCopy {
  if (locale === "en") return STAR_OF_BETLEHEM_EN
  return LOCALES[locale]
}
