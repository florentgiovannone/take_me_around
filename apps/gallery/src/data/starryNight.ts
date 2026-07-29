import en from "./starryNight.en.json"
import type { ArtworkPageLocale } from "../utils/artworkPageLocale"

export type StarryNightLocale = ArtworkPageLocale

export type StarryNightCopy = {
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

export const STARRY_NIGHT_EN: StarryNightCopy = en
