import type { ArtworkLocale } from "./audio"

const sectionAudioModules = import.meta.glob<string>("./audio/**/*.mp3", {
  eager: true,
  import: "default",
})

/** Returns a section MP3 URL for the given locale, falling back to English. */
export function getSectionAudio(
  workSlug: string,
  sectionId: string,
  locale: ArtworkLocale = "en"
): string | null {
  const localizedKey = `./audio/${locale}/${workSlug}/${sectionId}.mp3`
  if (sectionAudioModules[localizedKey]) return sectionAudioModules[localizedKey]

  const enKey = `./audio/en/${workSlug}/${sectionId}.mp3`
  return sectionAudioModules[enKey] ?? null
}
