/** Shared with src/utils/audioScript.ts — keep in sync when changing script rules. */

export const SPEECH_SECTION_PAUSE = '<break time="1.2s" />'

export function getAudioArtworkName(artwork) {
  return artwork.subtitle ?? artwork.title
}

export function formatArtistForSpeech(artist) {
  return artist
    .replace(/\(([^)]+)\)/g, ", $1")
    .replace(/[\u2013\u2014]/g, " to ")
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s+/g, " ")
    .trim()
}

export function formatArtistsForSpeech(artist) {
  return formatArtistForSpeech(artist).replace(/, with /gi, " and ")
}

export function getExhibitionSummary(artwork) {
  const aboutParagraphs = artwork.aboutParagraphs ?? []
  return artwork.summary ?? (aboutParagraphs.length > 1 ? aboutParagraphs[0] : null)
}

export function getEssayParagraphs(artwork) {
  const aboutParagraphs = artwork.aboutParagraphs ?? []
  if (aboutParagraphs.length === 0) return []
  if (artwork.summary) return aboutParagraphs
  if (aboutParagraphs.length > 1) return aboutParagraphs.slice(1)
  return aboutParagraphs
}

export function localizeWorkNamesForSpeech(artwork, text) {
  const english = artwork.subtitle
  const french = artwork.title
  if (!english || english === french) return text
  return text.split(french).join(english)
}

export function buildAudioScript(artwork) {
  const name = getAudioArtworkName(artwork)
  const artists = formatArtistsForSpeech(artwork.artist)
  const intro = getExhibitionSummary(artwork)
  const essayParagraphs = getEssayParagraphs(artwork)

  const sections = [`${name} by ${artists}.`]

  if (intro) {
    sections.push(`${SPEECH_SECTION_PAUSE}\n${intro}`)
  }

  if (essayParagraphs.length > 0) {
    const essay = ["About the work.", essayParagraphs.join("\n\n")].join("\n\n")
    sections.push(`${SPEECH_SECTION_PAUSE}\n${essay}`)
  }

  return localizeWorkNamesForSpeech(artwork, sections.join("\n\n"))
}
