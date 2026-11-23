const sectionAudioModules = import.meta.glob("./audio/**/*.mp3", {
  eager: true,
  import: "default",
}) as Record<string, string>

type WorkSectionAudio = Partial<Record<string, Partial<Record<string, string>>>>
const AUDIO_BY_LOCALE: Partial<Record<string, WorkSectionAudio>> = {}

for (const [path, url] of Object.entries(sectionAudioModules)) {
  const match = path.match(/\/audio\/([^/]+)\/([^/]+)\/([^/]+)\.mp3$/)
  if (!match) continue
  const [, locale, workSlug, sectionId] = match
  const forLocale = AUDIO_BY_LOCALE[locale] ?? {}
  const forWork = forLocale[workSlug] ?? {}
  forWork[sectionId] = url
  forLocale[workSlug] = forWork
  AUDIO_BY_LOCALE[locale] = forLocale
}

/** Returns a section MP3 URL when the asset exists; otherwise English, otherwise null. */
export function getSectionAudio(
  workSlug: string,
  sectionId: string,
  locale = "en"
): string | null {
  const localized = AUDIO_BY_LOCALE[locale]?.[workSlug]?.[sectionId]
  if (localized) return localized
  return AUDIO_BY_LOCALE.en?.[workSlug]?.[sectionId] ?? null
}
