import en from "./templeOfDendur.en.json"
import type { ArtworkPageLocale } from "../utils/artworkPageLocale"

export type TempleOfDendurLocale = ArtworkPageLocale

export type EssayFact = { k: string; v: string }
export type EssayMotif = { label: string; text: string }
export type EssaySection = {
  id: string
  heading: string
  paragraphs: string[]
  motifs?: EssayMotif[]
  afterNote?: string
  visitLabel?: string
  visitBody?: string
}

export type TempleOfDendurCopy = {
  banner: string
  eyebrow: string
  eyebrowParts: string[]
  title: string
  subtitle: string
  imageAlt: string
  figcaption: string
  credit: string
  facts: EssayFact[]
  lede: string
  sections: EssaySection[]
  colophonLeft: string
  colophonRight: string
}

export const TEMPLE_OF_DENDUR_EN: TempleOfDendurCopy = en
