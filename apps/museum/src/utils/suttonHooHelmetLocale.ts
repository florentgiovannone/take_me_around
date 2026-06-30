import type { SuttonHooHelmetCopy } from "../data/suttonHooHelmet"
import { SUTTON_HOO_HELMET_EN } from "../data/suttonHooHelmet"
import { SUTTON_HOO_HELMET_AR } from "../data/suttonHooHelmet.ar"
import { SUTTON_HOO_HELMET_DE } from "../data/suttonHooHelmet.de"
import { SUTTON_HOO_HELMET_ES } from "../data/suttonHooHelmet.es"
import { SUTTON_HOO_HELMET_FR } from "../data/suttonHooHelmet.fr"
import { SUTTON_HOO_HELMET_IT } from "../data/suttonHooHelmet.it"
import { SUTTON_HOO_HELMET_JA } from "../data/suttonHooHelmet.ja"
import { SUTTON_HOO_HELMET_KO } from "../data/suttonHooHelmet.ko"
import { SUTTON_HOO_HELMET_PT } from "../data/suttonHooHelmet.pt"
import { SUTTON_HOO_HELMET_TR } from "../data/suttonHooHelmet.tr"
import { SUTTON_HOO_HELMET_ZH } from "../data/suttonHooHelmet.zh"
import {
  detectArtworkPageLocale,
  type ArtworkPageLocale,
} from "./artworkPageLocale"

export function detectSuttonHooHelmetLocale(
  search?: Pick<URLSearchParams, "get">,
): ArtworkPageLocale {
  return detectArtworkPageLocale(search)
}

const LOCALES: Record<Exclude<ArtworkPageLocale, "en">, SuttonHooHelmetCopy> = {
  fr: SUTTON_HOO_HELMET_FR,
  ja: SUTTON_HOO_HELMET_JA,
  ar: SUTTON_HOO_HELMET_AR,
  de: SUTTON_HOO_HELMET_DE,
  es: SUTTON_HOO_HELMET_ES,
  ko: SUTTON_HOO_HELMET_KO,
  zh: SUTTON_HOO_HELMET_ZH,
  pt: SUTTON_HOO_HELMET_PT,
  tr: SUTTON_HOO_HELMET_TR,
  it: SUTTON_HOO_HELMET_IT,
}

export function resolveSuttonHooHelmetCopy(locale: ArtworkPageLocale): SuttonHooHelmetCopy {
  if (locale === "en") return SUTTON_HOO_HELMET_EN
  return LOCALES[locale]
}
