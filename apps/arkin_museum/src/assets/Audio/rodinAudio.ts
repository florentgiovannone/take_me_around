import type { ArtworkLocale } from "../../utils/artworkLocale"

const modules = import.meta.glob<string>("./rodin/*.mp3", {
  eager: true,
  import: "default",
})

/** Artwork slug (or slug-locale) → narration MP3 URL. */
export const RODIN_AUDIO: Partial<Record<string, string>> = {}

for (const [path, url] of Object.entries(modules)) {
  const slug = path.match(/\/([^/]+)\.mp3$/)?.[1]
  if (slug) RODIN_AUDIO[slug] = url
}

export function getRodinAudio(slug: string, locale: ArtworkLocale = "en"): string | undefined {
  if (locale === "tr") {
    return RODIN_AUDIO[`${slug}-tr`] ?? RODIN_AUDIO[slug]
  }
  return RODIN_AUDIO[slug]
}
