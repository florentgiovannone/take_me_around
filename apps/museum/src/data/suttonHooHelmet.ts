import en from "./suttonHooHelmet.en.json"
import type { ArtworkPageLocale } from "../utils/artworkPageLocale"

export type SuttonHooHelmetLocale = ArtworkPageLocale

export type SuttonHooHelmetCopy = {
  title: string
  subtitle: string
  bannerTop: string
  bannerBottom: string
  imageAlt: string
  aboutHelmetHeading: string
  aboutHelmetParagraphs: string[]
  aboutAngloSaxonsHeading: string
  aboutAngloSaxonsParagraphs: string[]
}

export const SUTTON_HOO_HELMET_EN: SuttonHooHelmetCopy = en
