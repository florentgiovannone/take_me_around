import en from "./twoFridas.en.json"
import type { ArtworkPageLocale } from "../utils/artworkPageLocale"

export type TwoFridasLocale = ArtworkPageLocale

export type TwoFridasCopy = {
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

export const TWO_FRIDAS_EN: TwoFridasCopy = en
