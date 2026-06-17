export type ArtworkLocale = "en" | "tr"

const enModules = import.meta.glob<string>("./en/*.mp3", {
  eager: true,
  import: "default",
})

const trModules = import.meta.glob<string>("./tr/*.mp3", {
  eager: true,
  import: "default",
})

function indexAudioBySlug(modules: Record<string, string>) {
  const audio: Partial<Record<string, string>> = {}
  for (const [path, url] of Object.entries(modules)) {
    const slug = path.match(/\/([^/]+)\.mp3$/)?.[1]
    if (slug) audio[slug] = url
  }
  return audio
}

const EN_AUDIO = indexAudioBySlug(enModules)
const TR_AUDIO = indexAudioBySlug(trModules)

export function getArtworkAudio(slug: string, locale: ArtworkLocale = "en"): string | undefined {
  if (locale === "tr") {
    return TR_AUDIO[slug] ?? EN_AUDIO[slug]
  }
  return EN_AUDIO[slug]
}
