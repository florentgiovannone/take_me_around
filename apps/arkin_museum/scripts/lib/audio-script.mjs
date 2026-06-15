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

/** Turkish narration artist line for ElevenLabs. */
export function formatArtistForTurkishSpeech(artist) {
  let text = artist.replace(/, with /gi, " ve ").replace(/ ile birlikte/gi, " ve")
  const paren = text.match(/^(.+?)\s*\(([^)]+)\)\s*$/)
  if (!paren) return text.trim()

  const [, name, details] = paren
  const years = details.match(/(\d{4})\s*[–—]\s*(\d{4})/)
  const nationality = details.replace(/,?\s*\d{4}.*$/, "").trim()
  if (years) {
    return `${name.trim()}, ${nationality}, ${years[1]} ile ${years[2]} yılları arasında`
  }
  return `${name.trim()}, ${details}`
}

export function getTurkishAudioArtworkName(artwork, tr) {
  return tr.subtitle ?? artwork.subtitle ?? artwork.title
}

export function getTurkishEssayParagraphs(artwork, tr) {
  const aboutParagraphs = tr.aboutParagraphs ?? []
  if (aboutParagraphs.length === 0) return []
  if (tr.summary) return aboutParagraphs
  if (aboutParagraphs.length > 1) return aboutParagraphs.slice(1)
  return aboutParagraphs
}

/** Turkish speech script from exhibition artwork + locale copy. */
export function buildTurkishAudioScript(artwork, tr) {
  const name = getTurkishAudioArtworkName(artwork, tr)
  const artists = formatArtistForTurkishSpeech(tr.artist ?? artwork.artist)
  const intro = tr.summary ?? null
  const essayParagraphs = getTurkishEssayParagraphs(artwork, tr)
  const aboutHeading = tr.aboutHeading ?? "Eser hakkında"

  const sections = [`${name}. ${artists}.`]

  if (intro) {
    sections.push(`${SPEECH_SECTION_PAUSE}\n${intro}`)
  }

  if (essayParagraphs.length > 0) {
    const essay = [aboutHeading, essayParagraphs.join("\n\n")].join("\n\n")
    sections.push(`${SPEECH_SECTION_PAUSE}\n${essay}`)
  }

  return sections.join("\n\n")
}
