import en from "./royalGameOfUr.en.json"
import type { ArtworkPageLocale } from "../utils/artworkPageLocale"

export type RoyalGameOfUrLocale = ArtworkPageLocale

export type RoyalGameOfUrCopy = {
  title: string
  subtitle: string
  bannerTop: string
  bannerBottom: string
  imageAlt: string
  aboutGameHeading: string
  aboutGameParagraphs: string[]
  aboutSumeriansHeading: string
  aboutSumeriansParagraphs: string[]
}

export const ROYAL_GAME_OF_UR_EN: RoyalGameOfUrCopy = en
