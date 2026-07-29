import type { TempleOfDendurCopy } from "../data/templeOfDendur"
import { TEMPLE_OF_DENDUR_EN } from "../data/templeOfDendur"
import { TEMPLE_OF_DENDUR_AR } from "../data/templeOfDendur.ar"
import { TEMPLE_OF_DENDUR_DE } from "../data/templeOfDendur.de"
import { TEMPLE_OF_DENDUR_ES } from "../data/templeOfDendur.es"
import { TEMPLE_OF_DENDUR_FR } from "../data/templeOfDendur.fr"
import { TEMPLE_OF_DENDUR_IT } from "../data/templeOfDendur.it"
import { TEMPLE_OF_DENDUR_JA } from "../data/templeOfDendur.ja"
import { TEMPLE_OF_DENDUR_KO } from "../data/templeOfDendur.ko"
import { TEMPLE_OF_DENDUR_PT } from "../data/templeOfDendur.pt"
import { TEMPLE_OF_DENDUR_TR } from "../data/templeOfDendur.tr"
import { TEMPLE_OF_DENDUR_ZH } from "../data/templeOfDendur.zh"
import { detectArtworkPageLocale, type ArtworkPageLocale } from "./artworkPageLocale"

export function detectTempleOfDendurLocale(
  search?: Pick<URLSearchParams, "get">,
): ArtworkPageLocale {
  return detectArtworkPageLocale(search)
}

const LOCALES: Record<Exclude<ArtworkPageLocale, "en">, TempleOfDendurCopy> = {
  fr: TEMPLE_OF_DENDUR_FR,
  ja: TEMPLE_OF_DENDUR_JA,
  ar: TEMPLE_OF_DENDUR_AR,
  de: TEMPLE_OF_DENDUR_DE,
  es: TEMPLE_OF_DENDUR_ES,
  ko: TEMPLE_OF_DENDUR_KO,
  zh: TEMPLE_OF_DENDUR_ZH,
  pt: TEMPLE_OF_DENDUR_PT,
  tr: TEMPLE_OF_DENDUR_TR,
  it: TEMPLE_OF_DENDUR_IT,
}

export function resolveTempleOfDendurCopy(locale: ArtworkPageLocale): TempleOfDendurCopy {
  if (locale === "en") return TEMPLE_OF_DENDUR_EN
  return LOCALES[locale]
}
