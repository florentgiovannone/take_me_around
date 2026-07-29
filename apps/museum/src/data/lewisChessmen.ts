import en from "./lewisChessmen.en.json"
import type { ArtworkPageLocale } from "../utils/artworkPageLocale"

export type LewisChessmenLocale = ArtworkPageLocale

export type LewisChessmenCopy = {
  title: string
  subtitle: string
  bannerTop: string
  bannerBottom: string
  imageAlt: string
  aboutChessmenHeading: string
  aboutChessmenParagraphs: string[]
  aboutNorseHeading: string
  aboutNorseParagraphs: string[]
}

export const LEWIS_CHESSMEN_EN: LewisChessmenCopy = en
