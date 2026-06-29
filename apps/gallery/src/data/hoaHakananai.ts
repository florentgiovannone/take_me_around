import en from "./hoaHakananai.en.json"

export type HoaHakananaiLocale = "en" | "fr" | "ja"

export type HoaHakananaiCopy = {
  title: string
  subtitle: string
  bannerTop: string
  bannerBottom: string
  imageAlt: string
  aboutHoaHeading: string
  aboutHoaParagraphs: string[]
  aboutRapaNuiHeading: string
  aboutRapaNuiParagraphs: string[]
}

export const HOA_HAKANANAI_EN: HoaHakananaiCopy = en
