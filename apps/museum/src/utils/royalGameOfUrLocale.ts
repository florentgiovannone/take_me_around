import type { RoyalGameOfUrCopy } from "../data/royalGameOfUr"
import { ROYAL_GAME_OF_UR_EN } from "../data/royalGameOfUr"
import { ROYAL_GAME_OF_UR_AR } from "../data/royalGameOfUr.ar"
import { ROYAL_GAME_OF_UR_DE } from "../data/royalGameOfUr.de"
import { ROYAL_GAME_OF_UR_ES } from "../data/royalGameOfUr.es"
import { ROYAL_GAME_OF_UR_FR } from "../data/royalGameOfUr.fr"
import { ROYAL_GAME_OF_UR_IT } from "../data/royalGameOfUr.it"
import { ROYAL_GAME_OF_UR_JA } from "../data/royalGameOfUr.ja"
import { ROYAL_GAME_OF_UR_KO } from "../data/royalGameOfUr.ko"
import { ROYAL_GAME_OF_UR_PT } from "../data/royalGameOfUr.pt"
import { ROYAL_GAME_OF_UR_TR } from "../data/royalGameOfUr.tr"
import { ROYAL_GAME_OF_UR_ZH } from "../data/royalGameOfUr.zh"
import {
  detectArtworkPageLocale,
  type ArtworkPageLocale,
} from "./artworkPageLocale"

export function detectRoyalGameOfUrLocale(
  search?: Pick<URLSearchParams, "get">,
): ArtworkPageLocale {
  return detectArtworkPageLocale(search)
}

const LOCALES: Record<Exclude<ArtworkPageLocale, "en">, RoyalGameOfUrCopy> = {
  fr: ROYAL_GAME_OF_UR_FR,
  ja: ROYAL_GAME_OF_UR_JA,
  ar: ROYAL_GAME_OF_UR_AR,
  de: ROYAL_GAME_OF_UR_DE,
  es: ROYAL_GAME_OF_UR_ES,
  ko: ROYAL_GAME_OF_UR_KO,
  zh: ROYAL_GAME_OF_UR_ZH,
  pt: ROYAL_GAME_OF_UR_PT,
  tr: ROYAL_GAME_OF_UR_TR,
  it: ROYAL_GAME_OF_UR_IT,
}

export function resolveRoyalGameOfUrCopy(locale: ArtworkPageLocale): RoyalGameOfUrCopy {
  if (locale === "en") return ROYAL_GAME_OF_UR_EN
  return LOCALES[locale]
}
