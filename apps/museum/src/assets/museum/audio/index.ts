export type ArtworkLocale = "en" | "fr" | "ja" | "tr"

const enModules = import.meta.glob<string>("./en/*.mp3", {
  eager: true,
  import: "default",
})

const frModules = import.meta.glob<string>("./fr/*.mp3", {
  eager: true,
  import: "default",
})

const jaModules = import.meta.glob<string>("./ja/*.mp3", {
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
const FR_AUDIO = indexAudioBySlug(frModules)
const JA_AUDIO = indexAudioBySlug(jaModules)
const TR_AUDIO = indexAudioBySlug(trModules)

export function getArtworkAudio(slug: string, locale: ArtworkLocale = "en"): string | undefined {
  if (locale === "fr") {
    return FR_AUDIO[slug] ?? EN_AUDIO[slug]
  }
  if (locale === "ja") {
    return JA_AUDIO[slug] ?? EN_AUDIO[slug]
  }
  if (locale === "tr") {
    return TR_AUDIO[slug] ?? EN_AUDIO[slug]
  }
  return EN_AUDIO[slug]
}
