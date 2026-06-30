import en from "./rosettaStone.en.json"
import type { ArtworkPageLocale } from "../utils/artworkPageLocale"

export type RosettaStoneLocale = ArtworkPageLocale

export type RosettaStoneCopy = {
  title: string
  subtitle: string
  bannerTop: string
  bannerBottom: string
  imageAlt: string
  aboutStoneHeading: string
  aboutStoneParagraphs: string[]
  aboutCultHeading: string
  aboutCultParagraphs: string[]
}

export const ROSETTA_STONE_EN: RosettaStoneCopy = en
