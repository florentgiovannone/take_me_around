import en from "./monaLisa.en.json"
import type { ArtworkPageLocale } from "../utils/artworkPageLocale"

export type MonaLisaLocale = ArtworkPageLocale

export type MonaLisaCopy = {
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

export const MONA_LISA_EN: MonaLisaCopy = en
