import en from "./starOfBetlehem.en.json"
import type { ArtworkPageLocale } from "../utils/artworkPageLocale"

export type StarOfBetlehemLocale = ArtworkPageLocale

export type StarOfBetlehemCopy = {
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

export const STAR_OF_BETLEHEM: StarOfBetlehemCopy = en
export const STAR_OF_BETLEHEM_EN: StarOfBetlehemCopy = en
