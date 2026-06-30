export type ArtworkLocale = "en" | "fr" | "ja" | "ar" | "de" | "es" | "ko" | "zh" | "pt" | "tr" | "it"

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

const arModules = import.meta.glob<string>("./ar/*.mp3", {
  eager: true,
  import: "default",
})

const deModules = import.meta.glob<string>("./de/*.mp3", {
  eager: true,
  import: "default",
})

const esModules = import.meta.glob<string>("./es/*.mp3", {
  eager: true,
  import: "default",
})

const koModules = import.meta.glob<string>("./ko/*.mp3", {
  eager: true,
  import: "default",
})

const zhModules = import.meta.glob<string>("./zh/*.mp3", {
  eager: true,
  import: "default",
})

const ptModules = import.meta.glob<string>("./pt/*.mp3", {
  eager: true,
  import: "default",
})

const trModules = import.meta.glob<string>("./tr/*.mp3", {
  eager: true,
  import: "default",
})

const itModules = import.meta.glob<string>("./it/*.mp3", {
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
const LOCALIZED_AUDIO: Partial<Record<ArtworkLocale, Partial<Record<string, string>>>> = {
  fr: indexAudioBySlug(frModules),
  ja: indexAudioBySlug(jaModules),
  ar: indexAudioBySlug(arModules),
  de: indexAudioBySlug(deModules),
  es: indexAudioBySlug(esModules),
  ko: indexAudioBySlug(koModules),
  zh: indexAudioBySlug(zhModules),
  pt: indexAudioBySlug(ptModules),
  tr: indexAudioBySlug(trModules),
  it: indexAudioBySlug(itModules),
}

export function getArtworkAudio(slug: string, locale: ArtworkLocale = "en"): string | undefined {
  if (locale === "en") return EN_AUDIO[slug]
  return LOCALIZED_AUDIO[locale]?.[slug] ?? EN_AUDIO[slug]
}
