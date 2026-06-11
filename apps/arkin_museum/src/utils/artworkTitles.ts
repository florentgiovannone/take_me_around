import type { RodinArtwork } from "../data/rodinArtworks"

/** French primary line; optional English translation on the line below in parentheses. */
export function getArtworkDisplayTitle(artwork: RodinArtwork): {
  french: string
  english?: string
} {
  return {
    french: artwork.title,
    english: artwork.subtitle,
  }
}

/** Browser tab title and plain-text references. */
export function getArtworkPageTitle(artwork: RodinArtwork): string {
  const { french, english } = getArtworkDisplayTitle(artwork)
  return english ? `${french} (${english})` : french
}
