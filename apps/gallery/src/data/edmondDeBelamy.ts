import en from "./edmondDeBelamy.en.json"
import type { ArtworkPageLocale } from "../utils/artworkPageLocale"

export type EdmondDeBelamyLocale = ArtworkPageLocale

export type EdmondDeBelamyCopy = {
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

export const EDMOND_DE_BELAMY_EN: EdmondDeBelamyCopy = en
