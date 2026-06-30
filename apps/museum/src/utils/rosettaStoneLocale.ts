import type { RosettaStoneCopy } from "../data/rosettaStone"
import { ROSETTA_STONE_EN } from "../data/rosettaStone"
import { ROSETTA_STONE_AR } from "../data/rosettaStone.ar"
import { ROSETTA_STONE_DE } from "../data/rosettaStone.de"
import { ROSETTA_STONE_ES } from "../data/rosettaStone.es"
import { ROSETTA_STONE_FR } from "../data/rosettaStone.fr"
import { ROSETTA_STONE_IT } from "../data/rosettaStone.it"
import { ROSETTA_STONE_JA } from "../data/rosettaStone.ja"
import { ROSETTA_STONE_KO } from "../data/rosettaStone.ko"
import { ROSETTA_STONE_PT } from "../data/rosettaStone.pt"
import { ROSETTA_STONE_TR } from "../data/rosettaStone.tr"
import { ROSETTA_STONE_ZH } from "../data/rosettaStone.zh"
import {
  detectArtworkPageLocale,
  type ArtworkPageLocale,
} from "./artworkPageLocale"

export function detectRosettaStoneLocale(
  search?: Pick<URLSearchParams, "get">,
): ArtworkPageLocale {
  return detectArtworkPageLocale(search)
}

const LOCALES: Record<Exclude<ArtworkPageLocale, "en">, RosettaStoneCopy> = {
  fr: ROSETTA_STONE_FR,
  ja: ROSETTA_STONE_JA,
  ar: ROSETTA_STONE_AR,
  de: ROSETTA_STONE_DE,
  es: ROSETTA_STONE_ES,
  ko: ROSETTA_STONE_KO,
  zh: ROSETTA_STONE_ZH,
  pt: ROSETTA_STONE_PT,
  tr: ROSETTA_STONE_TR,
  it: ROSETTA_STONE_IT,
}

export function resolveRosettaStoneCopy(locale: ArtworkPageLocale): RosettaStoneCopy {
  if (locale === "en") return ROSETTA_STONE_EN
  return LOCALES[locale]
}
