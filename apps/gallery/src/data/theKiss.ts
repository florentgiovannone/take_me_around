import en from "./theKiss.en.json"

export type EssayFact = { k: string; v: string }
export type EssayMotif = { label: string; text: string }
export type EssaySection = {
  id: string
  heading: string
  paragraphs: string[]
  motifs?: EssayMotif[]
  quote?: string
  quoteCite?: string
  visitLabel?: string
  visitBody?: string
}
export type TheKissCopy = {
  banner: string
  eyebrowParts: string[]
  title: string
  titleEm: string
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

export const THE_KISS_EN: TheKissCopy = en
