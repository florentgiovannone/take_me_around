import type { StarOfBethlehemCopy } from "../data/starOfBethlehem"
import { STAR_OF_BETHLEHEM_EN } from "../data/starOfBethlehem"
import { STAR_OF_BETHLEHEM_AR } from "../data/starOfBethlehem.ar"
import { STAR_OF_BETHLEHEM_DE } from "../data/starOfBethlehem.de"
import { STAR_OF_BETHLEHEM_ES } from "../data/starOfBethlehem.es"
import { STAR_OF_BETHLEHEM_FR } from "../data/starOfBethlehem.fr"
import { STAR_OF_BETHLEHEM_IT } from "../data/starOfBethlehem.it"
import { STAR_OF_BETHLEHEM_JA } from "../data/starOfBethlehem.ja"
import { STAR_OF_BETHLEHEM_KO } from "../data/starOfBethlehem.ko"
import { STAR_OF_BETHLEHEM_PT } from "../data/starOfBethlehem.pt"
import { STAR_OF_BETHLEHEM_TR } from "../data/starOfBethlehem.tr"
import { STAR_OF_BETHLEHEM_ZH } from "../data/starOfBethlehem.zh"
import {
  detectArtworkPageLocale,
  type ArtworkPageLocale,
} from "./artworkPageLocale"

export function detectStarOfBethlehemLocale(
  search?: Pick<URLSearchParams, "get">,
): ArtworkPageLocale {
  return detectArtworkPageLocale(search)
}

const LOCALES: Record<Exclude<ArtworkPageLocale, "en">, StarOfBethlehemCopy> = {
  fr: STAR_OF_BETHLEHEM_FR,
  ja: STAR_OF_BETHLEHEM_JA,
  ar: STAR_OF_BETHLEHEM_AR,
  de: STAR_OF_BETHLEHEM_DE,
  es: STAR_OF_BETHLEHEM_ES,
  ko: STAR_OF_BETHLEHEM_KO,
  zh: STAR_OF_BETHLEHEM_ZH,
  pt: STAR_OF_BETHLEHEM_PT,
  tr: STAR_OF_BETHLEHEM_TR,
  it: STAR_OF_BETHLEHEM_IT,
}

export function resolveStarOfBethlehemCopy(locale: ArtworkPageLocale): StarOfBethlehemCopy {
  if (locale === "en") return STAR_OF_BETHLEHEM_EN
  return LOCALES[locale]
}
