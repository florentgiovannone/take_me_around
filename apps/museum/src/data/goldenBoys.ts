import en from "./goldenBoys.en.json"
import type { ArtworkPageLocale } from "../utils/artworkPageLocale"

export type GoldenBoysLocale = ArtworkPageLocale

export type GoldenBoysCopy = {
  title: string
  detail: string
  subtitle: string
  bannerTop: string
  bannerBottom: string
  imageSrc: string
  imageAlt: string
  aboutWorkHeading: string
  aboutWorkParagraphs: string[]
  aboutArtistHeading: string
  aboutArtistParagraphs: string[]
}

export const GOLDEN_BOYS: GoldenBoysCopy = en
export const GOLDEN_BOYS_EN: GoldenBoysCopy = en
