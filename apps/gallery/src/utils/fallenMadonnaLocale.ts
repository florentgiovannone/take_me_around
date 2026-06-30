import type { FallenMadonnaCopy } from "../data/fallenMadonna"
import { FALLEN_MADONNA_EN } from "../data/fallenMadonna"
import { FALLEN_MADONNA_AR } from "../data/fallenMadonna.ar"
import { FALLEN_MADONNA_DE } from "../data/fallenMadonna.de"
import { FALLEN_MADONNA_ES } from "../data/fallenMadonna.es"
import { FALLEN_MADONNA_FR } from "../data/fallenMadonna.fr"
import { FALLEN_MADONNA_IT } from "../data/fallenMadonna.it"
import { FALLEN_MADONNA_JA } from "../data/fallenMadonna.ja"
import { FALLEN_MADONNA_KO } from "../data/fallenMadonna.ko"
import { FALLEN_MADONNA_PT } from "../data/fallenMadonna.pt"
import { FALLEN_MADONNA_TR } from "../data/fallenMadonna.tr"
import { FALLEN_MADONNA_ZH } from "../data/fallenMadonna.zh"
import {
  detectArtworkPageLocale,
  type ArtworkPageLocale,
} from "./artworkPageLocale"

export function detectFallenMadonnaLocale(
  search?: Pick<URLSearchParams, "get">,
): ArtworkPageLocale {
  return detectArtworkPageLocale(search)
}

const LOCALES: Record<Exclude<ArtworkPageLocale, "en">, FallenMadonnaCopy> = {
  fr: FALLEN_MADONNA_FR,
  ja: FALLEN_MADONNA_JA,
  ar: FALLEN_MADONNA_AR,
  de: FALLEN_MADONNA_DE,
  es: FALLEN_MADONNA_ES,
  ko: FALLEN_MADONNA_KO,
  zh: FALLEN_MADONNA_ZH,
  pt: FALLEN_MADONNA_PT,
  tr: FALLEN_MADONNA_TR,
  it: FALLEN_MADONNA_IT,
}

export function resolveFallenMadonnaCopy(locale: ArtworkPageLocale): FallenMadonnaCopy {
  if (locale === "en") return FALLEN_MADONNA_EN
  return LOCALES[locale]
}
