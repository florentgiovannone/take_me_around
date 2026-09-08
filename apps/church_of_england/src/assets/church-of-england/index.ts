import westminsterAbbeyImage from "./images/westminster-abbey-placeholder.svg"
import type { ArtworkPageLocale } from "../../utils/artworkPageLocale"

export const STOP_IMAGES: Record<string, string> = {
  "westminster-abbey": westminsterAbbeyImage,
}

const sectionAudioModules = import.meta.glob("./audio/**/*.mp3", {
  eager: true,
  import: "default",
}) as Record<string, string>

type WorkSectionAudio = Partial<Record<string, Partial<Record<string, string>>>>
const AUDIO_BY_LOCALE: Partial<Record<ArtworkPageLocale, WorkSectionAudio>> = {}

for (const [path, url] of Object.entries(sectionAudioModules)) {
  const match = path.match(/\/audio\/([^/]+)\/([^/]+)\/([^/]+)\.mp3$/)
  if (!match) continue
  const [, locale, workSlug, sectionId] = match
  const localeKey = locale as ArtworkPageLocale
  const forLocale = AUDIO_BY_LOCALE[localeKey] ?? {}
  const forWork = forLocale[workSlug] ?? {}
  forWork[sectionId] = url
  forLocale[workSlug] = forWork
  AUDIO_BY_LOCALE[localeKey] = forLocale
}

/** Returns a section MP3 URL when the asset exists; otherwise English, otherwise null. */
export function getSectionAudio(
  workSlug: string,
  sectionId: string,
  locale: ArtworkPageLocale = "en",
): string | null {
  const localized = AUDIO_BY_LOCALE[locale]?.[workSlug]?.[sectionId]
  if (localized) return localized
  return AUDIO_BY_LOCALE.en?.[workSlug]?.[sectionId] ?? null
}

/** @deprecated Prefer getSectionAudio for per-section players. */
export function getStopAudio(_slug: string): string | null {
  return null
}
