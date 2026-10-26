const SPEECH_SECTION_PAUSE = '<break time="1.2s" />'

/** Build ElevenLabs narration script from localized artwork page copy. */
export function buildArtworkAudioScript(copy, sections) {
  const introTitle = copy.detail ? `${copy.title}. ${copy.detail}.` : `${copy.title}.`
  const parts = [`${introTitle} ${copy.subtitle}.`]

  for (const section of sections) {
    const paragraphs = copy[section.paragraphsKey] ?? []
    if (paragraphs.length === 0) continue

    const heading = String(copy[section.headingKey] ?? "").replace(/\.\s*$/, "")
    parts.push(`${SPEECH_SECTION_PAUSE}\n${heading}.\n\n${paragraphs.join("\n\n")}`)
  }

  return parts.join("\n\n")
}
