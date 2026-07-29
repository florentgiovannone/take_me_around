import en from "./cyrusCylinder.en.json"
import type { ArtworkPageLocale } from "../utils/artworkPageLocale"

export type CyrusCylinderLocale = ArtworkPageLocale

export type CyrusCylinderCopy = {
  title: string
  subtitle: string
  bannerTop: string
  bannerBottom: string
  imageAlt: string
  aboutCylinderHeading: string
  aboutCylinderParagraphs: string[]
  aboutBabyloniansHeading: string
  aboutBabyloniansParagraphs: string[]
}

export const CYRUS_CYLINDER_EN: CyrusCylinderCopy = en
