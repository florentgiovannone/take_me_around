import type { RodinArtwork } from "../data/rodinArtworks"

/** Pause between narration sections (ElevenLabs SSML). */
export const SPEECH_SECTION_PAUSE = '<break time="1.2s" />'

/** Make catalogue artist line sound natural when read aloud. */
export function formatArtistForSpeech(artist: string): string {
  return artist
    .replace(/\(([^)]+)\)/g, ", $1")
    .replace(/[\u2013\u2014]/g, " to ")
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s+/g, " ")
    .trim()
}

/** Two artists: use "and" instead of ", with ". */
export function formatArtistsForSpeech(artist: string): string {
  return formatArtistForSpeech(artist).replace(/, with /gi, " and ")
}

/** English display name for narration (subtitle when set, else title). */
export function getAudioArtworkName(artwork: RodinArtwork): string {
  return artwork.subtitle ?? artwork.title
}

/** Italic intro above the player — matches RodinArtworkPage summary logic. */
export function getExhibitionSummary(artwork: RodinArtwork): string | null {
  const aboutParagraphs = artwork.aboutParagraphs ?? []
  return artwork.summary ?? (aboutParagraphs.length > 1 ? aboutParagraphs[0] : null)
}

/** Essay body below the image — matches RodinArtworkPage essay logic. */
export function getEssayParagraphs(artwork: RodinArtwork): string[] {
  const aboutParagraphs = artwork.aboutParagraphs ?? []
  if (aboutParagraphs.length === 0) return []
  if (artwork.summary) return aboutParagraphs
  if (aboutParagraphs.length > 1) return aboutParagraphs.slice(1)
  return aboutParagraphs
}

/** Use English work names in narration when a subtitle is set. */
export function localizeWorkNamesForSpeech(artwork: RodinArtwork, text: string): string {
  const english = artwork.subtitle
  const french = artwork.title
  if (!english || english === french) return text
  return text.split(french).join(english)
}

/**
 * Speech script:
 * [Artwork] by [artist(s)] → pause → summary → pause → About the work → essay
 */
export function buildAudioScript(artwork: RodinArtwork): string {
  const name = getAudioArtworkName(artwork)
  const artists = formatArtistsForSpeech(artwork.artist)
  const intro = getExhibitionSummary(artwork)
  const essayParagraphs = getEssayParagraphs(artwork)

  const sections: string[] = [`${name} by ${artists}.`]

  if (intro) {
    sections.push(`${SPEECH_SECTION_PAUSE}\n${intro}`)
  }

  if (essayParagraphs.length > 0) {
    const essay = ["About the work.", essayParagraphs.join("\n\n")].join("\n\n")
    sections.push(`${SPEECH_SECTION_PAUSE}\n${essay}`)
  }

  return localizeWorkNamesForSpeech(artwork, sections.join("\n\n"))
}
