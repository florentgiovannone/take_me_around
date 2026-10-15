import type { Artwork } from "./artworks"
import { localizeArtwork } from "./i18n/artworkCopy.ts"
import { fill, formatPrice, uiCopy } from "./i18n/uiCopy.ts"
import type { ArtworkPageLocale } from "./utils/artworkPageLocale"

/** Short pause between catalogue facts. */
export const SPEECH_FACT_PAUSE = '<break time="0.8s" />'

/** Longer pause before the essay. */
export const SPEECH_SECTION_PAUSE = '<break time="1.2s" />'

type SpokenLabels = {
  intro: string
  year: string
  medium: string
  gallery: string
  price: string
  about: string
}

const SPOKEN_LABELS: Record<ArtworkPageLocale, SpokenLabels> = {
  en: {
    intro: "{title} by {artist}.",
    year: "Year.",
    medium: "Medium.",
    gallery: "Gallery.",
    price: "Price.",
    about: "About the work.",
  },
  fr: {
    intro: "{title} par {artist}.",
    year: "Année.",
    medium: "Technique.",
    gallery: "Galerie.",
    price: "Prix.",
    about: "À propos de l’œuvre.",
  },
  ja: {
    intro: "{artist}による{title}。",
    year: "制作年。",
    medium: "技法。",
    gallery: "ギャラリー。",
    price: "価格。",
    about: "作品について。",
  },
  ar: {
    intro: "{title} لـ {artist}.",
    year: "السنة.",
    medium: "الخامة.",
    gallery: "المعرض.",
    price: "السعر.",
    about: "عن العمل.",
  },
  de: {
    intro: "{title} von {artist}.",
    year: "Jahr.",
    medium: "Technik.",
    gallery: "Galerie.",
    price: "Preis.",
    about: "Über das Werk.",
  },
  es: {
    intro: "{title} de {artist}.",
    year: "Año.",
    medium: "Técnica.",
    gallery: "Galería.",
    price: "Precio.",
    about: "Sobre la obra.",
  },
  ko: {
    intro: "{artist}의 {title}.",
    year: "연도.",
    medium: "재료.",
    gallery: "갤러리.",
    price: "가격.",
    about: "작품 소개.",
  },
  zh: {
    intro: "{artist}的《{title}》。",
    year: "年份。",
    medium: "媒介。",
    gallery: "画廊。",
    price: "价格。",
    about: "关于作品。",
  },
  pt: {
    intro: "{title} de {artist}.",
    year: "Ano.",
    medium: "Técnica.",
    gallery: "Galeria.",
    price: "Preço.",
    about: "Sobre a obra.",
  },
  tr: {
    intro: "{artist}, {title}.",
    year: "Yıl.",
    medium: "Teknik.",
    gallery: "Galeri.",
    price: "Fiyat.",
    about: "Eser hakkında.",
  },
  it: {
    intro: "{title} di {artist}.",
    year: "Anno.",
    medium: "Tecnica.",
    gallery: "Galleria.",
    price: "Prezzo.",
    about: "Sull’opera.",
  },
}

function speechPrice(price: string): string {
  return price.replace(/([£€$])\s+/g, "$1").trim()
}

/**
 * Spoken order is fixed for every work:
 * artwork by artist, year, medium, gallery, price, about the work.
 * Missing price is omitted. Dimensions, inventory, section, fair, and status stay off the track.
 */
export function buildArtworkAudioScript(
  artwork: Artwork,
  locale: ArtworkPageLocale = "en",
): string {
  const copy = locale === "en" ? artwork : localizeArtwork(artwork, locale)
  const labels = SPOKEN_LABELS[locale]
  const facts = [
    fill(labels.intro, { title: copy.title, artist: copy.artist }),
    `${labels.year} ${copy.year.trim()}.`,
    `${labels.medium} ${copy.medium.trim()}.`,
    `${labels.gallery} ${copy.gallery.trim()}.`,
  ]

  const price = copy.price?.trim()
  if (price) facts.push(`${labels.price} ${speechPrice(formatPrice(price, uiCopy(locale)))}.`)

  const about = [copy.standfirst, ...copy.paragraphs].map((part) => part.trim()).filter(Boolean)
  const sections = facts.map((fact, index) => (index === 0 ? fact : `${SPEECH_FACT_PAUSE}\n${fact}`))

  if (about.length > 0) {
    sections.push(`${SPEECH_SECTION_PAUSE}\n${labels.about}\n\n${about.join("\n\n")}`)
  }

  return sections.join("\n\n")
}

export function artworkAudioSrc(audioSrc: string, locale: ArtworkPageLocale = "en"): string {
  if (locale === "en") return audioSrc
  return audioSrc.replace("/audio/", `/audio/${locale}/`)
}
