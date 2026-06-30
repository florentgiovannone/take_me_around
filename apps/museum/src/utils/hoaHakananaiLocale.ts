import type { HoaHakananaiCopy, HoaHakananaiLocale } from "../data/hoaHakananai"
import { HOA_HAKANANAI_EN } from "../data/hoaHakananai"
import { HOA_HAKANANAI_AR } from "../data/hoaHakananai.ar"
import { HOA_HAKANANAI_DE } from "../data/hoaHakananai.de"
import { HOA_HAKANANAI_ES } from "../data/hoaHakananai.es"
import { HOA_HAKANANAI_FR } from "../data/hoaHakananai.fr"
import { HOA_HAKANANAI_IT } from "../data/hoaHakananai.it"
import { HOA_HAKANANAI_JA } from "../data/hoaHakananai.ja"
import { HOA_HAKANANAI_KO } from "../data/hoaHakananai.ko"
import { HOA_HAKANANAI_PT } from "../data/hoaHakananai.pt"
import { HOA_HAKANANAI_TR } from "../data/hoaHakananai.tr"
import { HOA_HAKANANAI_ZH } from "../data/hoaHakananai.zh"
import { detectArtworkPageLocale } from "./artworkPageLocale"

export function detectHoaLocale(search?: Pick<URLSearchParams, "get">): HoaHakananaiLocale {
  return detectArtworkPageLocale(search)
}

const LOCALES: Record<Exclude<HoaHakananaiLocale, "en">, HoaHakananaiCopy> = {
  fr: HOA_HAKANANAI_FR,
  ja: HOA_HAKANANAI_JA,
  ar: HOA_HAKANANAI_AR,
  de: HOA_HAKANANAI_DE,
  es: HOA_HAKANANAI_ES,
  ko: HOA_HAKANANAI_KO,
  zh: HOA_HAKANANAI_ZH,
  pt: HOA_HAKANANAI_PT,
  tr: HOA_HAKANANAI_TR,
  it: HOA_HAKANANAI_IT,
}

export function resolveHoaCopy(locale: HoaHakananaiLocale): HoaHakananaiCopy {
  if (locale === "en") return HOA_HAKANANAI_EN
  return LOCALES[locale]
}
