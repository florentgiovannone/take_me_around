import type { CyrusCylinderCopy } from "../data/cyrusCylinder"
import { CYRUS_CYLINDER_EN } from "../data/cyrusCylinder"
import { CYRUS_CYLINDER_AR } from "../data/cyrusCylinder.ar"
import { CYRUS_CYLINDER_DE } from "../data/cyrusCylinder.de"
import { CYRUS_CYLINDER_ES } from "../data/cyrusCylinder.es"
import { CYRUS_CYLINDER_FR } from "../data/cyrusCylinder.fr"
import { CYRUS_CYLINDER_IT } from "../data/cyrusCylinder.it"
import { CYRUS_CYLINDER_JA } from "../data/cyrusCylinder.ja"
import { CYRUS_CYLINDER_KO } from "../data/cyrusCylinder.ko"
import { CYRUS_CYLINDER_PT } from "../data/cyrusCylinder.pt"
import { CYRUS_CYLINDER_TR } from "../data/cyrusCylinder.tr"
import { CYRUS_CYLINDER_ZH } from "../data/cyrusCylinder.zh"
import {
  detectArtworkPageLocale,
  type ArtworkPageLocale,
} from "./artworkPageLocale"

export function detectCyrusCylinderLocale(
  search?: Pick<URLSearchParams, "get">,
): ArtworkPageLocale {
  return detectArtworkPageLocale(search)
}

const LOCALES: Record<Exclude<ArtworkPageLocale, "en">, CyrusCylinderCopy> = {
  fr: CYRUS_CYLINDER_FR,
  ja: CYRUS_CYLINDER_JA,
  ar: CYRUS_CYLINDER_AR,
  de: CYRUS_CYLINDER_DE,
  es: CYRUS_CYLINDER_ES,
  ko: CYRUS_CYLINDER_KO,
  zh: CYRUS_CYLINDER_ZH,
  pt: CYRUS_CYLINDER_PT,
  tr: CYRUS_CYLINDER_TR,
  it: CYRUS_CYLINDER_IT,
}

export function resolveCyrusCylinderCopy(locale: ArtworkPageLocale): CyrusCylinderCopy {
  if (locale === "en") return CYRUS_CYLINDER_EN
  return LOCALES[locale]
}
