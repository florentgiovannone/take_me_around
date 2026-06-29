const SPEECH_SECTION_PAUSE = '<break time="1.2s" />'

/** Build ElevenLabs narration script from localized Hoa page copy. */
export function buildHoaAudioScript(copy) {
  const aboutHoaHeading = copy.aboutHoaHeading.replace(/\.\s*$/, "")

  const sections = [`${copy.title}. ${copy.subtitle}.`]

  if (copy.aboutHoaParagraphs.length > 0) {
    sections.push(
      `${SPEECH_SECTION_PAUSE}\n${aboutHoaHeading}.\n\n${copy.aboutHoaParagraphs.join("\n\n")}`,
    )
  }

  if (copy.aboutRapaNuiParagraphs.length > 0) {
    sections.push(
      `${SPEECH_SECTION_PAUSE}\n${copy.aboutRapaNuiHeading}.\n\n${copy.aboutRapaNuiParagraphs.join("\n\n")}`,
    )
  }

  return sections.join("\n\n")
}
