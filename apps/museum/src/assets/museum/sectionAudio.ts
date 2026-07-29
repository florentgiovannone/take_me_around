import type { ArtworkLocale } from "./audio"

export type { ArtworkLocale }

const sectionModules = import.meta.glob<string>("./audio/**/*.mp3", {
  eager: true,
  import: "default",
})

type WorkSectionAudio = Partial<Record<string, Partial<Record<string, string>>>>

const AUDIO_BY_LOCALE: Partial<Record<ArtworkLocale, WorkSectionAudio>> = {}

for (const [path, url] of Object.entries(sectionModules)) {
  const match = path.match(/\/audio\/([^/]+)\/([^/]+)\/([^/]+)\.mp3$/)
  if (!match) continue
  const [, locale, workSlug, sectionId] = match
  const localeKey = locale as ArtworkLocale
  const forLocale = AUDIO_BY_LOCALE[localeKey] ?? {}
  const forWork = forLocale[workSlug] ?? {}
  forWork[sectionId] = url
  forLocale[workSlug] = forWork
  AUDIO_BY_LOCALE[localeKey] = forLocale
}

/** Section mp3 for a work, falling back to the English recording when the locale is missing. */
export function getSectionAudio(
  workSlug: string,
  sectionId: string,
  locale: ArtworkLocale = "en"
): string | undefined {
  const localized = AUDIO_BY_LOCALE[locale]?.[workSlug]?.[sectionId]
  if (localized) return localized
  return AUDIO_BY_LOCALE.en?.[workSlug]?.[sectionId]
}
