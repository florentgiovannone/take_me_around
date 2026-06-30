import en from "./fallenMadonna.en.json"
import type { ArtworkPageLocale } from "../utils/artworkPageLocale"

export type FallenMadonnaLocale = ArtworkPageLocale

export type FallenMadonnaCopy = {
  title: string
  subtitle: string
  bannerTop: string
  bannerBottom: string
  imageAlt: string
  aboutPaintingHeading: string
  aboutPaintingParagraphs: string[]
  aboutArtistHeading: string
  aboutArtistParagraphs: string[]
}

export const FALLEN_MADONNA_EN: FallenMadonnaCopy = en
