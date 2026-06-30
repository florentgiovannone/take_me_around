import en from "./qingmingFestival.en.json"
import type { ArtworkPageLocale } from "../utils/artworkPageLocale"

export type QingmingFestivalLocale = ArtworkPageLocale

export type QingmingFestivalCopy = {
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

export const QINGMING_FESTIVAL_EN: QingmingFestivalCopy = en
