import type { RodinArtwork } from "../data/rodinArtworks"
import { RODIN_ARTWORK_LOCALES_TR } from "../data/rodinArtworks.tr"

export type ArtworkLocale = "en" | "tr"

export type ResolvedArtworkCopy = RodinArtwork & {
  locale: ArtworkLocale
  aboutHeading: string
  sourcesLabel: string
  exhibitionEyebrow: string
  plateCaption: string | null
}

export function detectArtworkLocale(search?: Pick<URLSearchParams, "get">): ArtworkLocale {
  const forced = search?.get("lang")?.toLowerCase()
  if (forced === "tr" || forced === "turkish") return "tr"
  if (forced === "en" || forced === "english") return "en"

  if (typeof navigator === "undefined") return "en"

  const candidates = [...(navigator.languages ?? []), navigator.language]
    .filter(Boolean)
    .map((lang) => lang.toLowerCase())

  for (const lang of candidates) {
    if (lang === "tr" || lang.startsWith("tr-")) return "tr"
  }

  return "en"
}

export function resolveArtworkCopy(
  artwork: RodinArtwork,
  locale: ArtworkLocale
): ResolvedArtworkCopy {
  const tr =
    locale === "tr" ? (artwork.locales?.tr ?? RODIN_ARTWORK_LOCALES_TR[artwork.slug]) : undefined
  const meta = tr?.meta ? { ...artwork.meta, ...tr.meta } : artwork.meta

  return {
    ...artwork,
    locale,
    subtitle: tr?.subtitle ?? artwork.subtitle,
    artist: tr?.artist ?? artwork.artist,
    caption: tr?.caption ?? artwork.caption,
    summary: tr?.summary ?? artwork.summary,
    aboutParagraphs: tr?.aboutParagraphs ?? artwork.aboutParagraphs,
    sources: tr?.sources ?? artwork.sources,
    meta,
    aboutHeading: tr?.aboutHeading ?? "About the work",
    sourcesLabel: tr?.sourcesLabel ?? "Sources:",
    exhibitionEyebrow: tr?.exhibitionEyebrow ?? "Arkın Rodin Collection — Sculpture",
    plateCaption: tr?.plateCaption ?? null,
  }
}
