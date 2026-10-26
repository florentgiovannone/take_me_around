import en from "./starOfBethlehem.en.json"
import type { ArtworkPageLocale } from "../utils/artworkPageLocale"

export type StarOfBethlehemLocale = ArtworkPageLocale

export type StarOfBethlehemCopy = {
  title: string
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

export const STAR_OF_BETHLEHEM: StarOfBethlehemCopy = en
export const STAR_OF_BETHLEHEM_EN: StarOfBethlehemCopy = en
